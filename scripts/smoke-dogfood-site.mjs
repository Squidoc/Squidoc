import { readFile } from "node:fs/promises";
import { join } from "node:path";

const repoRoot = new URL("..", import.meta.url).pathname;
const distRoot = join(repoRoot, "examples/squidoc-docs/dist");

const pages = [
  {
    file: "docs/index.html",
    route: "/docs",
    title: "Introduction | Squidoc",
    canonical: "https://squidoc.com/docs",
  },
  {
    file: "docs/cli/index.html",
    route: "/docs/cli",
    title: "CLI Reference | Squidoc",
    canonical: "https://squidoc.com/docs/cli",
  },
  {
    file: "docs/configuration/index.html",
    route: "/docs/configuration",
    title: "Configuration | Squidoc",
    canonical: "https://squidoc.com/docs/configuration",
  },
  {
    file: "docs/developers/index.html",
    route: "/docs/developers",
    title: "Authoring Extensions | Squidoc",
    canonical: "https://squidoc.com/docs/developers",
  },
  {
    file: "docs/deployment/index.html",
    route: "/docs/deployment",
    title: "Deployment | Squidoc",
    canonical: "https://squidoc.com/docs/deployment",
  },
  {
    file: "docs/frontmatter/index.html",
    route: "/docs/frontmatter",
    title: "Frontmatter | Squidoc",
    canonical: "https://squidoc.com/docs/frontmatter",
  },
  {
    file: "docs/plugin-authoring/index.html",
    route: "/docs/plugin-authoring",
    title: "Plugin Authoring | Squidoc",
    canonical: "https://squidoc.com/docs/plugin-authoring",
  },
  {
    file: "docs/theme-authoring/index.html",
    route: "/docs/theme-authoring",
    title: "Theme Authoring | Squidoc",
    canonical: "https://squidoc.com/docs/theme-authoring",
  },
  {
    file: "docs/getting-started/index.html",
    route: "/docs/getting-started",
    title: "Getting Started | Squidoc",
    canonical: "https://squidoc.com/docs/getting-started",
  },
  {
    file: "docs/plugins/index.html",
    route: "/docs/plugins",
    title: "Plugins | Squidoc",
    canonical: "https://squidoc.com/docs/plugins",
  },
  {
    file: "docs/pages/index.html",
    route: "/docs/pages",
    title: "Pages | Squidoc",
    canonical: "https://squidoc.com/docs/pages",
  },
  {
    file: "docs/themes/index.html",
    route: "/docs/themes",
    title: "Themes | Squidoc",
    canonical: "https://squidoc.com/docs/themes",
  },
  {
    file: "docs/versioning/index.html",
    route: "/docs/versioning",
    title: "Versioning | Squidoc",
    canonical: "https://squidoc.com/docs/versioning",
  },
  {
    file: "docs/i18n/index.html",
    route: "/docs/i18n",
    title: "Internationalization | Squidoc",
    canonical: "https://squidoc.com/docs/i18n",
  },
  {
    file: "docs/mdx/index.html",
    route: "/docs/mdx",
    title: "MDX | Squidoc",
    canonical: "https://squidoc.com/docs/mdx",
  },
];
const archivedPages = pages.map((page) => ({
  ...page,
  file: page.file.replace("docs/", "docs/versions/0.1/"),
  route:
    page.route === "/docs"
      ? "/docs/versions/0.1"
      : page.route.replace("/docs", "/docs/versions/0.1"),
  canonical:
    page.route === "/docs"
      ? "https://squidoc.com/docs/versions/0.1"
      : `https://squidoc.com${page.route.replace("/docs", "/docs/versions/0.1")}`,
}));
const localizedPages = [
  {
    file: "es/docs/index.html",
    route: "/es/docs",
    title: "Introducción | Squidoc",
    canonical: "https://squidoc.com/es/docs",
  },
  {
    file: "es/docs/configuration/index.html",
    route: "/es/docs/configuration",
    title: "Configuración | Squidoc",
    canonical: "https://squidoc.com/es/docs/configuration",
  },
  {
    file: "es/docs/versions/0.1/index.html",
    route: "/es/docs/versions/0.1",
    title: "Introducción | Squidoc",
    canonical: "https://squidoc.com/es/docs/versions/0.1",
  },
  {
    file: "es/docs/versions/0.1/configuration/index.html",
    route: "/es/docs/versions/0.1/configuration",
    title: "Configuración | Squidoc",
    canonical: "https://squidoc.com/es/docs/versions/0.1/configuration",
  },
  {
    file: "es/docs/versions/0.1/i18n/index.html",
    route: "/es/docs/versions/0.1/i18n",
    title: "Internacionalización | Squidoc",
    canonical: "https://squidoc.com/es/docs/versions/0.1/i18n",
  },
];
const allPages = [...pages, ...archivedPages, ...localizedPages];

for (const page of allPages) {
  const html = await readDistFile(page.file);

  assertIncludes(html, `<title>${page.title}</title>`, page.file);
  assertIncludes(html, `rel="canonical" href="${page.canonical}"`, page.file);
  assertIncludes(html, "data-squidoc-search", page.file);
  assertIncludes(html, "data-squidoc-versions", page.file);
  assertIncludes(html, "data-squidoc-locales", page.file);
}

const home = await readDistFile("index.html");
assertIncludes(home, "<title>Squidoc | Squidoc</title>", "index.html");
assertIncludes(home, 'href="/docs/getting-started"', "index.html");
assertIncludes(home, "sq-home", "index.html");
assertIncludes(home, 'rel="apple-touch-icon"', "index.html");
assertIncludes(home, 'href="/favicon-32x32.png"', "index.html");
assertIncludes(home, 'href="/favicon-16x16.png"', "index.html");
assertIncludes(home, 'rel="manifest" href="/site.webmanifest"', "index.html");
assertIncludes(home, 'rel="shortcut icon" href="/favicon.ico"', "index.html");
assertIncludes(home, 'src="/squidoc-logo.svg"', "index.html");

for (const file of [
  "android-chrome-192x192.png",
  "android-chrome-512x512.png",
  "apple-touch-icon.png",
  "favicon-16x16.png",
  "favicon-32x32.png",
  "favicon.ico",
  "squidoc-logo.svg",
  "site.webmanifest",
]) {
  await readDistFile(file);
}

const pluginAuthoring = await readDistFile("docs/plugin-authoring/index.html");
assertIncludes(pluginAuthoring, 'class="shiki github-light"', "docs/plugin-authoring/index.html");
assertIncludes(pluginAuthoring, "data-squidoc-codeblock", "docs/plugin-authoring/index.html");
assertIncludes(pluginAuthoring, "data-squidoc-copy-code", "docs/plugin-authoring/index.html");
assertIncludes(pluginAuthoring, "<details open>", "docs/plugin-authoring/index.html");
assertIncludes(pluginAuthoring, "data-squidoc-article-tree", "docs/plugin-authoring/index.html");
assertIncludes(pluginAuthoring, "IntersectionObserver", "docs/plugin-authoring/index.html");
assertIncludes(pluginAuthoring, "sq-topbar", "docs/plugin-authoring/index.html");
assertIncludes(pluginAuthoring, "sq-sidebar-toggle", "docs/plugin-authoring/index.html");
assertIncludes(pluginAuthoring, "sq-footer", "docs/plugin-authoring/index.html");
assertIncludes(pluginAuthoring, "sq-version-selector", "docs/plugin-authoring/index.html");
assertIncludes(pluginAuthoring, "Built with Squidoc.", "docs/plugin-authoring/index.html");
assert(
  pluginAuthoring.indexOf('class="sq-search" data-squidoc-search') <
    pluginAuthoring.indexOf('class="sq-sidebar"'),
  "plugin-authoring/index.html should render search before the sidebar",
);

const archivedVersioning = await readDistFile("docs/versions/0.1/versioning/index.html");
assertIncludes(
  archivedVersioning,
  'href="/docs/versions/0.1/configuration"',
  "docs/versions/0.1/versioning/index.html",
);
assertIncludes(
  archivedVersioning,
  'href="/docs/versions/0.1/plugin-authoring"',
  "docs/versions/0.1/versioning/index.html",
);
assert(
  !archivedVersioning.includes("<span>Versions</span>"),
  "docs/versions/0.1/versioning/index.html should not render a redundant Versions nav folder",
);

const searchIndex = JSON.parse(await readDistFile("search-index.json"));
assert(
  Array.isArray(searchIndex) && searchIndex.length === allPages.length,
  "search-index.json should include every dogfood page",
);
assert(
  allPages.every((page) => searchIndex.some((entry) => entry.route === page.route)),
  "search-index.json is missing one or more dogfood routes",
);

const versions = JSON.parse(await readDistFile("versions.json"));
assert(
  Array.isArray(versions) &&
    versions.some((version) => version.name === "next" && version.current === true) &&
    versions.some(
      (version) => version.name === "0.1" && version.routePrefix === "/docs/versions/0.1",
    ) &&
    versions.some(
      (version) => version.name === "0.1" && version.routePrefix === "/es/docs/versions/0.1",
    ),
  "versions.json should include current and archived dogfood versions",
);

const locales = JSON.parse(await readDistFile("locales.json"));
assert(
  Array.isArray(locales) &&
    locales.some((locale) => locale.code === "en" && locale.current === true) &&
    locales.some((locale) => locale.code === "es" && locale.routePrefix === "/es"),
  "locales.json should include English and Spanish locales",
);

const llms = await readDistFile("llms.txt");
assertIncludes(llms, "[MDX](https://squidoc.com/docs/mdx)", "llms.txt");
assertIncludes(llms, "[CLI Reference](https://squidoc.com/docs/cli)", "llms.txt");
assertIncludes(llms, "[Deployment](https://squidoc.com/docs/deployment)", "llms.txt");
assertIncludes(llms, "[Frontmatter](https://squidoc.com/docs/frontmatter)", "llms.txt");
assertIncludes(llms, "[Plugins](https://squidoc.com/docs/plugins)", "llms.txt");
assertIncludes(llms, "[Themes](https://squidoc.com/docs/themes)", "llms.txt");
assertIncludes(llms, "[Versioning](https://squidoc.com/docs/versioning)", "llms.txt");
assertIncludes(llms, "[Versioning](https://squidoc.com/docs/versions/0.1/versioning)", "llms.txt");
assertIncludes(llms, "[Authoring Extensions](https://squidoc.com/docs/developers)", "llms.txt");
assertIncludes(llms, "[Plugin Authoring](https://squidoc.com/docs/plugin-authoring)", "llms.txt");
assertIncludes(llms, "[Theme Authoring](https://squidoc.com/docs/theme-authoring)", "llms.txt");

const llmsFull = await readDistFile("llms-full.txt");
assertIncludes(llmsFull, "Component-based MDX is not compiled yet.", "llms-full.txt");
assertIncludes(llmsFull, "Squidoc builds a static site.", "llms-full.txt");
assertIncludes(llmsFull, "`doctor` reports:", "llms-full.txt");
assertIncludes(llmsFull, "Supported fields", "llms-full.txt");
assertIncludes(llmsFull, "Plugins add behavior to a Squidoc site", "llms-full.txt");
assertIncludes(llmsFull, "Themes control the structure and presentation", "llms-full.txt");
assertIncludes(llmsFull, "@squidoc/plugin-versions", "llms-full.txt");
assertIncludes(llmsFull, "Squidoc is designed to stay simple for authors", "llms-full.txt");
assertIncludes(llmsFull, "The setup API currently supports:", "llms-full.txt");
assertIncludes(llmsFull, "Themes should be able to change navigation placement", "llms-full.txt");

console.log("Dogfood generated-site smoke passed.");

async function readDistFile(path) {
  return readFile(join(distRoot, path), "utf8");
}

function assertIncludes(value, expected, label) {
  assert(value.includes(expected), `${label} should include ${expected}`);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
