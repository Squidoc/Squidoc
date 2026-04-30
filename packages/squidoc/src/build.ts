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

  const html = await renderMarkdown(page.content);
  const navItems = pages.map((navPage) => ({
    title: navPage.title,
    route: navPage.route,
    current: navPage.route === page.route,
  }));
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

  await writeFile(
    target,
    `---
const site = ${JSON.stringify(loaded.config.site)};
const page = ${JSON.stringify({ title: page.title, description: page.description, route: page.route })};
const navItems = ${JSON.stringify(navItems)};
const content = ${JSON.stringify(html)};
const classes = ${JSON.stringify(classes)};
const headHtml = ${JSON.stringify(headHtml)};
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
    <div class={classes.shell}>
      <aside class={classes.sidebar}>
        <h1 class={classes.brand}>{site.name}</h1>
        <nav class={classes.nav} aria-label="Documentation">
          {navItems.map((item) => (
            <a href={item.route} aria-current={item.current ? "page" : undefined}>{item.title}</a>
          ))}
        </nav>
      </aside>
      <main class={classes.content}>
        <Fragment set:html={content} />
      </main>
    </div>
  </body>
</html>
`,
  );
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
