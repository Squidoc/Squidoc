import { spawn } from "node:child_process";
import { mkdir, rm, symlink, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import {
  type DocPage,
  type GeneratedFile,
  type HeadTag,
  type LoadedConfig,
  type NavItem,
  type PluginContext,
  type ResolvedSquidocConfig,
  type SquidocTheme,
  discoverDocs,
  loadConfig,
  loadTheme,
  runPlugins,
} from "@squidoc/core";
import { type FSWatcher, watch } from "chokidar";
import { renderMarkdown } from "./markdown.js";

const require = createRequire(import.meta.url);
const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));

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
  await linkPackageDependencies(internalRoot);

  return { internalRoot, plugins };
}

async function generateAstroProject(cwd: string, internalRoot: string): Promise<PluginContext> {
  const loaded = await loadConfig({ cwd });
  const capabilities = await runPlugins(loaded.config, [], cwd);
  const pages = await discoverDocs(loaded.config, cwd, {
    extensions: capabilities.docExtensions,
  });
  const theme = await loadTheme(loaded.config, cwd);
  const plugins = await runPlugins(loaded.config, pages, cwd);

  if (pages.length === 0) {
    throw new Error(`No documentation pages found in ${loaded.config.docsDir}.`);
  }

  await writeAstroProject(internalRoot, cwd, loaded, pages, theme, plugins);
  return plugins;
}

async function linkPackageDependencies(internalRoot: string): Promise<void> {
  const target = join(internalRoot, "node_modules");
  await rm(target, { recursive: true, force: true });
  await symlink(join(packageRoot, "node_modules"), target, "dir");
}

async function writeAstroProject(
  internalRoot: string,
  cwd: string,
  loaded: LoadedConfig,
  pages: DocPage[],
  theme: SquidocTheme,
  plugins: PluginContext,
): Promise<void> {
  await rm(join(internalRoot, "src", "pages"), { recursive: true, force: true });
  await mkdir(join(internalRoot, "src", "pages"), { recursive: true });
  await writeFile(join(internalRoot, "package.json"), JSON.stringify({ type: "module" }, null, 2));
  await writeFile(
    join(internalRoot, "astro.config.mjs"),
    `export default {
  outDir: ${JSON.stringify(join(cwd, "dist"))},
  publicDir: ${JSON.stringify(join(cwd, "public"))},
  site: ${JSON.stringify(loaded.config.site.url)},
};
`,
  );

  for (const page of pages) {
    await writePage(internalRoot, loaded, pages, page, theme, plugins);
  }
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
  return [
    join(cwd, config.docsDir),
    join(cwd, "docs.config.ts"),
    join(cwd, "docs.config.mjs"),
    join(cwd, "docs.config.js"),
  ];
}

async function writePage(
  internalRoot: string,
  loaded: LoadedConfig,
  pages: DocPage[],
  page: DocPage,
  theme: SquidocTheme,
  plugins: PluginContext,
): Promise<void> {
  const outputPath = page.route === "/" ? "index.astro" : `${page.route.slice(1)}/index.astro`;
  const target = join(internalRoot, "src", "pages", outputPath);
  await mkdir(dirname(target), { recursive: true });

  const html = await transformHtml(await renderMarkdown(page.content), page, plugins);
  const navHtml = renderNavHtml(buildNavTree(loaded.config.nav, pages), page.route);
  const themeOptions = getThemeOptions(loaded.config);
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
  const headHtml = renderHeadTags([
    ...plugins.headTags,
    ...plugins.pageHeadTagFactories.flatMap((factory) => factory(page)),
  ]);
  const slots = {
    articleTree: renderThemeSlot(plugins, "article-tree"),
    search: renderThemeSlot(plugins, "search"),
  };

  await writeFile(
    target,
    `---
const site = ${JSON.stringify(loaded.config.site)};
const page = ${JSON.stringify({ title: page.title, description: page.description, route: page.route })};
const content = ${JSON.stringify(html)};
const classes = ${JSON.stringify(classes)};
const headHtml = ${JSON.stringify(headHtml)};
const headerLinksHtml = ${JSON.stringify(headerLinksHtml)};
const footer = ${JSON.stringify({ text: footer.text })};
const footerLinksHtml = ${JSON.stringify(footerLinksHtml)};
const navHtml = ${JSON.stringify(navHtml)};
const slots = ${JSON.stringify(slots)};
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{page.title} | {site.name}</title>
    {page.description && <meta name="description" content={page.description} />}
    <Fragment set:html={headHtml} />
    <style is:global>${theme.renderer?.globalCss ?? ""}</style>
  </head>
  <body>
    <header class="sq-topbar">
      <a class="sq-topbar__brand" href="/">{site.name}</a>
      <nav class="sq-topbar__nav" aria-label="Site">
        <Fragment set:html={headerLinksHtml} />
      </nav>
      <label class="sq-sidebar-toggle" for="squidoc-sidebar-toggle">Menu</label>
    </header>
    <input class="sq-sidebar-control" id="squidoc-sidebar-toggle" type="checkbox" aria-label="Toggle documentation navigation" />
    <div class={classes.shell}>
      <aside class={classes.sidebar}>
        <h1 class={classes.brand}>{site.name}</h1>
        <Fragment set:html={slots.search} />
        <nav class={classes.nav} aria-label="Documentation">
          <Fragment set:html={navHtml} />
        </nav>
      </aside>
      <main class={classes.content}>
        <Fragment set:html={content} />
      </main>
      <aside class="sq-article-tree">
        <Fragment set:html={slots.articleTree} />
      </aside>
    </div>
    <footer class="sq-footer">
      {footer.text && <p class="sq-footer__text">{footer.text}</p>}
      <nav class="sq-footer__nav" aria-label="Footer">
        <Fragment set:html={footerLinksHtml} />
      </nav>
    </footer>
  </body>
</html>
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

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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
