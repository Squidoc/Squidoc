import { spawn } from "node:child_process";
import { mkdir, rm, symlink, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { type DocPage, type LoadedConfig, discoverDocs, loadConfig } from "@squidoc/core";
import { marked } from "marked";

const require = createRequire(import.meta.url);
const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));

const THEME_CSS = `:root {
  color-scheme: light;
  --squidoc-accent: #2563eb;
  --squidoc-border: #d8dee8;
  --squidoc-text: #172033;
  --squidoc-muted: #5f6f89;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

body {
  margin: 0;
  color: var(--squidoc-text);
  background: #ffffff;
}

a {
  color: var(--squidoc-accent);
}

.shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
}

.sidebar {
  border-right: 1px solid var(--squidoc-border);
  padding: 24px;
}

.brand {
  margin: 0 0 24px;
  font-size: 18px;
}

.nav {
  display: grid;
  gap: 10px;
}

.nav a {
  color: var(--squidoc-muted);
  text-decoration: none;
}

.nav a[aria-current="page"] {
  color: var(--squidoc-text);
  font-weight: 700;
}

.content {
  max-width: 820px;
  padding: 48px;
}

.content h1 {
  font-size: 42px;
  line-height: 1.1;
}

.content p,
.content li {
  line-height: 1.7;
}

@media (max-width: 760px) {
  .shell {
    display: block;
  }

  .sidebar {
    border-right: 0;
    border-bottom: 1px solid var(--squidoc-border);
  }

  .content {
    padding: 28px;
  }
}
`;

export type BuildOptions = {
  cwd?: string;
};

export async function buildSite(options: BuildOptions = {}): Promise<void> {
  const cwd = options.cwd ?? process.cwd();
  const loaded = await loadConfig({ cwd });
  const pages = await discoverDocs(loaded.config, cwd);

  if (pages.length === 0) {
    throw new Error(`No Markdown pages found in ${loaded.config.docsDir}.`);
  }

  const internalRoot = join(cwd, ".squidoc", "astro");
  await rm(internalRoot, { recursive: true, force: true });
  await writeAstroProject(internalRoot, cwd, loaded, pages);
  await linkPackageDependencies(internalRoot);
  await runAstroBuild(internalRoot);
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
    await writePage(internalRoot, loaded, pages, page);
  }
}

async function writePage(
  internalRoot: string,
  loaded: LoadedConfig,
  pages: DocPage[],
  page: DocPage,
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

  await writeFile(
    target,
    `---
const site = ${JSON.stringify(loaded.config.site)};
const page = ${JSON.stringify({ title: page.title, description: page.description, route: page.route })};
const navItems = ${JSON.stringify(navItems)};
const content = ${JSON.stringify(html)};
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{page.title} | {site.name}</title>
    {page.description && <meta name="description" content={page.description} />}
    <style is:global>${THEME_CSS}</style>
  </head>
  <body>
    <div class="shell">
      <aside class="sidebar">
        <h1 class="brand">{site.name}</h1>
        <nav class="nav" aria-label="Documentation">
          {navItems.map((item) => (
            <a href={item.route} aria-current={item.current ? "page" : undefined}>{item.title}</a>
          ))}
        </nav>
      </aside>
      <main class="content">
        <Fragment set:html={content} />
      </main>
    </div>
  </body>
</html>
`,
  );
}

async function runAstroBuild(internalRoot: string): Promise<void> {
  const astroPackage = require.resolve("astro/package.json");
  const astroBin = join(dirname(astroPackage), "astro.js");

  await new Promise<void>((resolve, reject) => {
    const child = spawn(process.execPath, [astroBin, "build"], {
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
        reject(new Error(`Astro build failed with exit code ${code}.`));
      }
    });
  });
}
