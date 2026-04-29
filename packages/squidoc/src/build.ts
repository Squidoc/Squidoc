import { spawn } from "node:child_process";
import { mkdir, rm, symlink, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import {
  type DocPage,
  type GeneratedFile,
  type LoadedConfig,
  type SquidocTheme,
  discoverDocs,
  loadConfig,
  loadTheme,
  runPlugins,
} from "@squidoc/core";
import { marked } from "marked";

const require = createRequire(import.meta.url);
const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));

export type BuildOptions = {
  cwd?: string;
};

export type ServeOptions = {
  cwd?: string;
};

export async function buildSite(options: BuildOptions = {}): Promise<void> {
  const cwd = options.cwd ?? process.cwd();
  const internalRoot = await prepareAstroProject(cwd);
  await runAstro(internalRoot, "build");
  await writeGeneratedFiles(join(cwd, "dist"), (await runConfiguredPlugins(cwd)).generatedFiles);
}

export async function devSite(options: ServeOptions = {}): Promise<void> {
  const internalRoot = await prepareAstroProject(options.cwd ?? process.cwd());
  await runAstro(internalRoot, "dev");
}

export async function previewSite(options: ServeOptions = {}): Promise<void> {
  const internalRoot = await prepareAstroProject(options.cwd ?? process.cwd());
  await runAstro(internalRoot, "preview");
}

async function prepareAstroProject(cwd: string): Promise<string> {
  const loaded = await loadConfig({ cwd });
  const pages = await discoverDocs(loaded.config, cwd);
  const theme = await loadTheme(loaded.config, cwd);

  if (pages.length === 0) {
    throw new Error(`No Markdown pages found in ${loaded.config.docsDir}.`);
  }

  const internalRoot = join(cwd, ".squidoc", "astro");
  await rm(internalRoot, { recursive: true, force: true });
  await writeAstroProject(internalRoot, cwd, loaded, pages, theme);
  await linkPackageDependencies(internalRoot);

  return internalRoot;
}

async function runConfiguredPlugins(cwd: string) {
  const loaded = await loadConfig({ cwd });
  const pages = await discoverDocs(loaded.config, cwd);
  return runPlugins(loaded.config, pages, cwd);
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
): Promise<void> {
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
    await writePage(internalRoot, loaded, pages, page, theme);
  }
}

async function writePage(
  internalRoot: string,
  loaded: LoadedConfig,
  pages: DocPage[],
  page: DocPage,
  theme: SquidocTheme,
): Promise<void> {
  const outputPath = page.route === "/" ? "index.astro" : `${page.route.slice(1)}/index.astro`;
  const target = join(internalRoot, "src", "pages", outputPath);
  await mkdir(dirname(target), { recursive: true });

  const html = await marked.parse(page.content);
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

  await writeFile(
    target,
    `---
const site = ${JSON.stringify(loaded.config.site)};
const page = ${JSON.stringify({ title: page.title, description: page.description, route: page.route })};
const navItems = ${JSON.stringify(navItems)};
const content = ${JSON.stringify(html)};
const classes = ${JSON.stringify(classes)};
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{page.title} | {site.name}</title>
    {page.description && <meta name="description" content={page.description} />}
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

async function runAstro(internalRoot: string, command: "build" | "dev" | "preview"): Promise<void> {
  const astroPackage = require.resolve("astro/package.json");
  const astroBin = join(dirname(astroPackage), "astro.js");

  await new Promise<void>((resolve, reject) => {
    const child = spawn(process.execPath, [astroBin, command], {
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
