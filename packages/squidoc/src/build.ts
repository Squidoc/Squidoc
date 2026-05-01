import { spawn } from "node:child_process";
import { copyFile, cp, mkdir, rm, symlink, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import {
  type DocPage,
  type GeneratedFile,
  type HeadTag,
  type NavItem,
  type PluginContext,
  type ResolvedSquidocConfig,
  type SitePage,
  type SquidocTheme,
  applyProjectTransforms,
  discoverDocs,
  loadConfig,
  loadTheme,
  runPlugins,
} from "@squidoc/core";
import { type FSWatcher, watch } from "chokidar";
import { renderMarkdown } from "./markdown.js";

const require = createRequire(import.meta.url);
const templatesRoot = join(dirname(fileURLToPath(import.meta.url)), "templates");

export type BuildOptions = {
  cwd?: string;
};

export type ServeOptions = {
  cwd?: string;
  astroArgs?: string[];
};

type PreparedAstroProject = {
  internalRoot: string;
  plugins: PluginContext;
};

export async function buildSite(options: BuildOptions = {}): Promise<void> {
  const cwd = options.cwd ?? process.cwd();
  const prepared = await prepareAstroProject(cwd);
  await runAstro(prepared.internalRoot, "build");
  await writeGeneratedFiles(join(cwd, "dist"), prepared.plugins.generatedFiles);
}

export async function devSite(options: ServeOptions = {}): Promise<void> {
  const cwd = options.cwd ?? process.cwd();
  const prepared = await prepareAstroProject(cwd);
  const watcher = await watchDevInputs(cwd, prepared.internalRoot);

  try {
    await runAstro(prepared.internalRoot, "dev", options.astroArgs);
  } finally {
    await watcher.close();
  }
}

export async function previewSite(options: ServeOptions = {}): Promise<void> {
  const prepared = await prepareAstroProject(options.cwd ?? process.cwd());
  await runAstro(prepared.internalRoot, "preview", options.astroArgs);
}

async function prepareAstroProject(cwd: string): Promise<PreparedAstroProject> {
  const internalRoot = join(cwd, ".squidoc", "astro");
  await rm(internalRoot, { recursive: true, force: true });
  const plugins = await generateAstroProject(cwd, internalRoot);
  await linkRuntimeDependencies(internalRoot);

  return { internalRoot, plugins };
}

async function generateAstroProject(cwd: string, internalRoot: string): Promise<PluginContext> {
  const loaded = await loadConfig({ cwd });
  const capabilities = await runPlugins(loaded.config, [], cwd);
  const pages = await discoverDocs(loaded.config, cwd, {
    extensions: capabilities.docExtensions,
  });
  const project = await applyProjectTransforms(
    { pages, nav: loaded.config.nav },
    capabilities.projectTransformers,
  );
  const config = { ...loaded.config, nav: project.nav };
  const theme = await loadTheme(loaded.config, cwd);
  const plugins = await runPlugins(config, project.pages, cwd);

  if (project.pages.length === 0) {
    throw new Error(`No documentation pages found in ${loaded.config.docsDir}.`);
  }

  validateRouteCollisions(project.pages, plugins.sitePages);
  await writeAstroProject(internalRoot, cwd, config, project.pages, theme, plugins);
  return plugins;
}

async function linkRuntimeDependencies(internalRoot: string): Promise<void> {
  const nodeModules = join(internalRoot, "node_modules");
  await rm(nodeModules, { recursive: true, force: true });
  await mkdir(nodeModules, { recursive: true });
  await linkResolvedPackage("astro", nodeModules);
}

async function linkResolvedPackage(packageName: string, nodeModules: string): Promise<void> {
  const source = dirname(require.resolve(`${packageName}/package.json`));
  const target = join(nodeModules, ...packageName.split("/"));

  await mkdir(dirname(target), { recursive: true });
  await symlink(source, target, process.platform === "win32" ? "junction" : "dir");
}

async function writeAstroProject(
  internalRoot: string,
  cwd: string,
  config: ResolvedSquidocConfig,
  pages: DocPage[],
  theme: SquidocTheme,
  plugins: PluginContext,
): Promise<void> {
  const publicDir = join(internalRoot, "public");

  await rm(join(internalRoot, "src", "pages"), { recursive: true, force: true });
  await mkdir(join(internalRoot, "src", "pages"), { recursive: true });
  await preparePublicDir(publicDir, join(cwd, "public"), plugins.generatedFiles);
  await writeFile(join(internalRoot, "package.json"), JSON.stringify({ type: "module" }, null, 2));
  await writeFile(
    join(internalRoot, "squidoc.config.mjs"),
    `export default ${JSON.stringify(
      {
        outDir: join(cwd, "dist"),
        publicDir,
        site: config.site.url,
      },
      null,
      2,
    )};
`,
  );
  await copyFile(join(templatesRoot, "astro.config.mjs"), join(internalRoot, "astro.config.mjs"));
  await copyFile(
    join(templatesRoot, "page.astro"),
    join(internalRoot, "src", "pages", "[...route].astro"),
  );
  await mkdir(join(internalRoot, "src", "layouts"), { recursive: true });
  await copyFile(
    join(templatesRoot, "page-layout.astro"),
    join(internalRoot, "src", "layouts", "SquidocPageLayout.astro"),
  );
  await copySitePageSources(internalRoot, plugins.sitePages);
  await writeSitePageRoutes(internalRoot, config, pages, plugins.sitePages);
  await writeRenderData(internalRoot, config, pages, theme, plugins);
}

async function preparePublicDir(
  publicDir: string,
  userPublicDir: string,
  generatedFiles: GeneratedFile[],
): Promise<void> {
  await rm(publicDir, { recursive: true, force: true });

  try {
    await cp(userPublicDir, publicDir, { recursive: true, force: true });
  } catch (error) {
    if (!isNodeError(error) || error.code !== "ENOENT") {
      throw error;
    }

    await mkdir(publicDir, { recursive: true });
  }

  await writeGeneratedFiles(publicDir, generatedFiles);
}

async function watchDevInputs(cwd: string, internalRoot: string): Promise<FSWatcher> {
  const loaded = await loadConfig({ cwd });
  const watchedPaths = getWatchedPaths(cwd, loaded.config);
  const watcher = watch(watchedPaths, {
    ignoreInitial: true,
  });
  let timer: NodeJS.Timeout | undefined;

  const regenerate = () => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      generateAstroProject(cwd, internalRoot).catch((error: unknown) => {
        console.error(error instanceof Error ? error.message : String(error));
      });
    }, 75);
  };

  watcher.on("add", regenerate);
  watcher.on("change", regenerate);
  watcher.on("unlink", regenerate);

  return watcher;
}

function getWatchedPaths(cwd: string, config: ResolvedSquidocConfig): string[] {
  return uniquePaths([
    join(cwd, config.docsDir),
    ...getConfiguredPageDirs(config).map((pagesDir) => join(cwd, pagesDir)),
    join(cwd, "docs.config.ts"),
    join(cwd, "docs.config.mjs"),
    join(cwd, "docs.config.js"),
  ]);
}

function getConfiguredPageDirs(config: ResolvedSquidocConfig): string[] {
  const pageDirs = new Set(["pages"]);

  for (const plugin of config.plugins) {
    if (typeof plugin === "string" || plugin.name !== "@squidoc/plugin-pages") {
      continue;
    }

    pageDirs.add(readString(plugin.options.pagesDir) ?? "pages");
  }

  return [...pageDirs];
}

function uniquePaths(paths: string[]): string[] {
  return [...new Set(paths)];
}

async function copySitePageSources(internalRoot: string, sitePages: SitePage[]): Promise<void> {
  const roots = [...new Set(sitePages.map((page) => page.sourceRoot))];

  await Promise.all(
    roots.map((root, index) =>
      cp(root, join(internalRoot, "src", "squidoc-pages", String(index)), {
        recursive: true,
        force: true,
      }),
    ),
  );
}

async function writeSitePageRoutes(
  internalRoot: string,
  config: ResolvedSquidocConfig,
  docsPages: DocPage[],
  sitePages: SitePage[],
): Promise<void> {
  const sourceRoots = [...new Set(sitePages.map((page) => page.sourceRoot))];

  for (const [index, page] of sitePages.entries()) {
    const target = join(
      internalRoot,
      "src",
      "pages",
      ...routeToSegments(page.route),
      "index.astro",
    );
    const sourceRootIndex = sourceRoots.indexOf(page.sourceRoot);
    const sourceRelativePath = relative(page.sourceRoot, page.sourcePath);
    const componentPath = join(
      internalRoot,
      "src",
      "squidoc-pages",
      String(sourceRootIndex),
      sourceRelativePath,
    );
    const componentImport = normalizeImportPath(relative(dirname(target), componentPath));
    const layoutImport = normalizeImportPath(
      relative(dirname(target), join(internalRoot, "src", "layouts", "SquidocPageLayout.astro")),
    );

    await mkdir(dirname(target), { recursive: true });
    await writeFile(
      target,
      `---
import PageLayout from "${layoutImport}";
import UserPage from "${componentImport}";
import { sitePages } from "${normalizeImportPath(relative(dirname(target), join(internalRoot, "src", "squidoc-data.mjs")))}";

const data = sitePages[${index}];
---

<PageLayout data={data}>
  <UserPage />
</PageLayout>
`,
    );
  }

  if (!sitePages.some((page) => page.route === "/")) {
    const target = join(internalRoot, "src", "pages", "index.astro");
    await writeFile(
      target,
      renderRedirectPage(config.docs.basePath, docsPages[0]?.title ?? config.site.name),
    );
  }
}

async function writeRenderData(
  internalRoot: string,
  config: ResolvedSquidocConfig,
  pages: DocPage[],
  theme: SquidocTheme,
  plugins: PluginContext,
): Promise<void> {
  const themeOptions = getThemeOptions(config);
  const headerLinksHtml = renderLinkListHtml(
    readLinks(themeOptions.headerLinks),
    "sq-topbar__link",
  );
  const footer = readFooter(themeOptions.footer);
  const footerLinksHtml = renderLinkListHtml(footer.links, "sq-footer__link");
  const classes = {
    brand: theme.renderer?.classes?.brand ?? "brand",
    content: theme.renderer?.classes?.content ?? "content",
    nav: theme.renderer?.classes?.nav ?? "nav",
    shell: theme.renderer?.classes?.shell ?? "shell",
    sidebar: theme.renderer?.classes?.sidebar ?? "sidebar",
  };
  const slots = {
    articleTree: renderThemeSlot(plugins, "article-tree"),
    localeSelector: renderThemeSlot(plugins, "locale-selector"),
    search: renderThemeSlot(plugins, "search"),
    versionSelector: renderThemeSlot(plugins, "version-selector"),
  };
  const renderPages = await Promise.all(
    pages.map(async (page) => ({
      site: config.site,
      page: {
        description: page.description,
        lang: readString(page.frontmatter.squidocLocale) ?? "en",
        route: page.route,
        title: page.title,
      },
      content: await transformHtml(
        rewriteDocsLinks(await renderMarkdown(page.content), pages),
        page,
        plugins,
      ),
      classes,
      globalCss: theme.renderer?.globalCss ?? "",
      headHtml: renderHeadTags([
        ...plugins.headTags,
        ...plugins.pageHeadTagFactories.flatMap((factory) => factory(page)),
      ]),
      headerLinksHtml,
      footer: { text: footer.text },
      footerLinksHtml,
      navHtml: renderNavHtml(
        buildNavTree(page.nav ?? prefixNav(config.nav, config.docs.basePath), pages),
        page.route,
      ),
      slots,
    })),
  );
  const sitePages = pagesForSiteShell(config, pages, theme, plugins, plugins.sitePages);

  await writeFile(
    join(internalRoot, "src", "squidoc-data.mjs"),
    `export const pages = ${JSON.stringify(renderPages, null, 2)};
export const sitePages = ${JSON.stringify(sitePages, null, 2)};
`,
  );
}

type RenderNavItem = {
  title: string;
  path?: string;
  items?: RenderNavItem[];
};

type RenderLink = {
  title: string;
  href: string;
};

type RenderFooter = {
  text?: string;
  links: RenderLink[];
};

type ThemeOptions = Record<string, unknown>;

function pagesForSiteShell(
  config: ResolvedSquidocConfig,
  docsPages: DocPage[],
  theme: SquidocTheme,
  plugins: PluginContext,
  sitePages: SitePage[],
) {
  const themeOptions = getThemeOptions(config);
  const footer = readFooter(themeOptions.footer);
  const classes = {
    brand: theme.renderer?.classes?.brand ?? "brand",
    content: theme.renderer?.classes?.content ?? "content",
    nav: theme.renderer?.classes?.nav ?? "nav",
    shell: theme.renderer?.classes?.shell ?? "shell",
    sidebar: theme.renderer?.classes?.sidebar ?? "sidebar",
  };
  const slots = {
    articleTree: renderThemeSlot(plugins, "article-tree"),
    localeSelector: renderThemeSlot(plugins, "locale-selector"),
    search: renderThemeSlot(plugins, "search"),
    versionSelector: renderThemeSlot(plugins, "version-selector"),
  };

  return sitePages.map((page) => ({
    site: config.site,
    page: {
      description: page.description,
      lang: "en",
      route: page.route,
      title: page.title ?? config.site.name,
    },
    layout: page.layout,
    classes,
    globalCss: theme.renderer?.globalCss ?? "",
    headHtml: renderHeadTags(plugins.headTags),
    headerLinksHtml: renderLinkListHtml(readLinks(themeOptions.headerLinks), "sq-topbar__link"),
    footer: { text: footer.text },
    footerLinksHtml: renderLinkListHtml(footer.links, "sq-footer__link"),
    navHtml: renderNavHtml(
      buildNavTree(prefixNav(config.nav, config.docs.basePath), docsPages),
      page.route,
    ),
    slots,
  }));
}

function prefixNav(items: NavItem[], docsBasePath: string): NavItem[] {
  return items.map((item) => ({
    ...item,
    path: item.path ? joinRoutes(docsBasePath, item.path) : undefined,
    items: item.items ? prefixNav(item.items, docsBasePath) : undefined,
  }));
}

function rewriteDocsLinks(html: string, pages: DocPage[]): string {
  const routeByDocsRoute = new Map(pages.map((page) => [page.docsRoute, page.route]));

  return html.replaceAll(/href="([^"]+)"/g, (match, href: string) => {
    if (!href.startsWith("/")) {
      return match;
    }

    const [pathWithQuery = "", hash = ""] = href.split("#");
    const [path = "", query = ""] = pathWithQuery.split("?");
    const normalizedPath = normalizeRoute(path);
    const route = routeByDocsRoute.get(normalizedPath);

    if (!route) {
      return match;
    }

    const suffix = `${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
    return `href="${escapeHtml(`${route}${suffix}`)}"`;
  });
}

function getThemeOptions(config: ResolvedSquidocConfig): ThemeOptions {
  return typeof config.theme === "string" ? {} : config.theme.options;
}

function readFooter(value: unknown): RenderFooter {
  if (!isRecord(value)) {
    return { links: [] };
  }

  return {
    text: readString(value.text),
    links: readLinks(value.links),
  };
}

function readLinks(value: unknown): RenderLink[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!isRecord(item)) {
      return [];
    }

    const title = readString(item.title);
    const href = readString(item.href) ?? readString(item.path);

    return title && href ? [{ title, href }] : [];
  });
}

function renderLinkListHtml(links: RenderLink[], className: string): string {
  return links
    .map(
      (link) =>
        `<a class="${className}" href="${escapeHtml(link.href)}">${escapeHtml(link.title)}</a>`,
    )
    .join("");
}

function buildNavTree(configNav: NavItem[], pages: DocPage[]): RenderNavItem[] {
  if (configNav.length > 0) {
    return configNav;
  }

  return pages.map((page) => ({
    title: page.title,
    path: page.route,
  }));
}

function renderNavHtml(items: RenderNavItem[], currentRoute: string): string {
  return `<ul class="sq-nav__list">${items.map((item) => renderNavItem(item, currentRoute)).join("")}</ul>`;
}

function renderNavItem(item: RenderNavItem, currentRoute: string): string {
  const children = item.items ?? [];
  const isCurrent = item.path === currentRoute;
  const isExpanded =
    isCurrent || children.some((child) => navItemContainsRoute(child, currentRoute));
  const currentAttribute = isCurrent ? ' aria-current="page"' : "";
  const link = item.path
    ? `<a href="${escapeHtml(item.path)}"${currentAttribute}>${escapeHtml(item.title)}</a>`
    : `<span>${escapeHtml(item.title)}</span>`;

  if (children.length === 0) {
    return `<li class="sq-nav__item">${link}</li>`;
  }

  return `<li class="sq-nav__item sq-nav__item--group">
  <details${isExpanded ? " open" : ""}>
    <summary>${link}</summary>
    ${renderNavHtml(children, currentRoute)}
  </details>
</li>`;
}

function navItemContainsRoute(item: RenderNavItem, route: string): boolean {
  return (
    item.path === route || (item.items ?? []).some((child) => navItemContainsRoute(child, route))
  );
}

async function transformHtml(html: string, page: DocPage, plugins: PluginContext): Promise<string> {
  let transformed = html;

  for (const transformer of plugins.htmlTransformers) {
    transformed = await transformer(transformed, page);
  }

  return transformed;
}

function renderThemeSlot(plugins: PluginContext, name: string): string {
  return plugins.themeSlots
    .filter((slot) => slot.name === name && slot.html)
    .map((slot) => slot.html)
    .join("\n");
}

function renderHeadTags(tags: HeadTag[]): string {
  return tags.map(renderHeadTag).join("\n");
}

function renderHeadTag(tag: HeadTag): string {
  const attrs = Object.entries(tag.attrs)
    .map(([name, value]) => `${name}="${escapeHtml(value)}"`)
    .join(" ");

  if (tag.content) {
    return `<${tag.tag} ${attrs}>${escapeHtml(tag.content)}</${tag.tag}>`;
  }

  return `<${tag.tag} ${attrs}>`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function validateRouteCollisions(docsPages: DocPage[], sitePages: SitePage[]): void {
  const routes = new Set(docsPages.map((page) => page.route));
  const duplicateSiteRoutes = new Set<string>();

  for (const page of sitePages) {
    if (routes.has(page.route)) {
      throw new Error(`Page route conflicts with a documentation route: ${page.route}`);
    }

    if (duplicateSiteRoutes.has(page.route)) {
      throw new Error(`Duplicate page route found: ${page.route}`);
    }

    duplicateSiteRoutes.add(page.route);
  }
}

function renderRedirectPage(target: string, title: string): string {
  const href = escapeHtml(target);

  return `---
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0; url=${href}" />
    <link rel="canonical" href="${href}" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body>
    <p>Redirecting to <a href="${href}">${href}</a>.</p>
    <script>window.location.replace(${JSON.stringify(target)});</script>
  </body>
</html>
`;
}

function routeToSegments(route: string): string[] {
  return normalizeRoute(route).split("/").filter(Boolean);
}

function normalizeImportPath(path: string): string {
  const normalized = path.split(sep).join("/");

  return normalized.startsWith(".") ? normalized : `./${normalized}`;
}

function joinRoutes(prefix: string, remainder: string): string {
  const normalizedPrefix = normalizeRoute(prefix);
  const cleanRemainder = remainder.replace(/^\/+/, "").replace(/\/+$/, "");

  if (!cleanRemainder) {
    return normalizedPrefix;
  }

  return `${normalizedPrefix === "/" ? "" : normalizedPrefix}/${cleanRemainder}`;
}

function normalizeRoute(route: string): string {
  const prefixed = route.startsWith("/") ? route : `/${route}`;
  const withoutTrailingSlash = prefixed.replace(/\/index$/, "").replace(/\/+$/, "");

  return withoutTrailingSlash === "" ? "/" : withoutTrailingSlash;
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}

async function runAstro(
  internalRoot: string,
  command: "build" | "dev" | "preview",
  args: string[] = [],
): Promise<void> {
  const astroPackage = require.resolve("astro/package.json");
  const astroBin = join(dirname(astroPackage), "astro.js");

  await new Promise<void>((resolve, reject) => {
    const child = spawn(process.execPath, [astroBin, command, ...args], {
      cwd: internalRoot,
      env: {
        ...process.env,
        ASTRO_TELEMETRY_DISABLED: "1",
      },
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Astro ${command} failed with exit code ${code}.`));
      }
    });
  });
}

async function writeGeneratedFiles(outDir: string, files: GeneratedFile[]): Promise<void> {
  const root = resolve(outDir);

  for (const file of files) {
    const target = resolve(root, file.path);

    if (target !== root && !target.startsWith(`${root}${sep}`)) {
      throw new Error(`Generated file path escapes the output directory: ${file.path}`);
    }

    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, file.contents);
  }
}
