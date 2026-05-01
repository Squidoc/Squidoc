import { readFile } from "node:fs/promises";
import { join } from "node:path";

const repoRoot = new URL("..", import.meta.url).pathname;
const distRoot = join(repoRoot, "examples/squidoc-docs/dist");

const pages = [
  {
    file: "index.html",
    route: "/",
    title: "Introduction | Squidoc",
    canonical: "https://squidoc.dev/",
  },
  {
    file: "cli/index.html",
    route: "/cli",
    title: "CLI Reference | Squidoc",
    canonical: "https://squidoc.dev/cli",
  },
  {
    file: "configuration/index.html",
    route: "/configuration",
    title: "Configuration | Squidoc",
    canonical: "https://squidoc.dev/configuration",
  },
  {
    file: "developers/index.html",
    route: "/developers",
    title: "Authoring Extensions | Squidoc",
    canonical: "https://squidoc.dev/developers",
  },
  {
    file: "deployment/index.html",
    route: "/deployment",
    title: "Deployment | Squidoc",
    canonical: "https://squidoc.dev/deployment",
  },
  {
    file: "frontmatter/index.html",
    route: "/frontmatter",
    title: "Frontmatter | Squidoc",
    canonical: "https://squidoc.dev/frontmatter",
  },
  {
    file: "plugin-authoring/index.html",
    route: "/plugin-authoring",
    title: "Plugin Authoring | Squidoc",
    canonical: "https://squidoc.dev/plugin-authoring",
  },
  {
    file: "theme-authoring/index.html",
    route: "/theme-authoring",
    title: "Theme Authoring | Squidoc",
    canonical: "https://squidoc.dev/theme-authoring",
  },
  {
    file: "getting-started/index.html",
    route: "/getting-started",
    title: "Getting Started | Squidoc",
    canonical: "https://squidoc.dev/getting-started",
  },
  {
    file: "plugins/index.html",
    route: "/plugins",
    title: "Plugins | Squidoc",
    canonical: "https://squidoc.dev/plugins",
  },
  {
    file: "themes/index.html",
    route: "/themes",
    title: "Themes | Squidoc",
    canonical: "https://squidoc.dev/themes",
  },
  {
    file: "versioning/index.html",
    route: "/versioning",
    title: "Versioning | Squidoc",
    canonical: "https://squidoc.dev/versioning",
  },
  {
    file: "mdx/index.html",
    route: "/mdx",
    title: "MDX | Squidoc",
    canonical: "https://squidoc.dev/mdx",
  },
];

for (const page of pages) {
  const html = await readDistFile(page.file);

  assertIncludes(html, `<title>${page.title}</title>`, page.file);
  assertIncludes(html, `rel="canonical" href="${page.canonical}"`, page.file);
  assertIncludes(html, "data-squidoc-search", page.file);
  assertIncludes(html, `href="${page.route}"`, page.file);
}

const pluginAuthoring = await readDistFile("plugin-authoring/index.html");
assertIncludes(pluginAuthoring, 'class="shiki github-light"', "plugin-authoring/index.html");
assertIncludes(pluginAuthoring, "data-squidoc-codeblock", "plugin-authoring/index.html");
assertIncludes(pluginAuthoring, "data-squidoc-copy-code", "plugin-authoring/index.html");
assertIncludes(pluginAuthoring, "<details open>", "plugin-authoring/index.html");
assertIncludes(pluginAuthoring, "data-squidoc-article-tree", "plugin-authoring/index.html");
assertIncludes(pluginAuthoring, "IntersectionObserver", "plugin-authoring/index.html");
assertIncludes(pluginAuthoring, "sq-topbar", "plugin-authoring/index.html");
assertIncludes(pluginAuthoring, "sq-sidebar-toggle", "plugin-authoring/index.html");
assertIncludes(pluginAuthoring, "sq-footer", "plugin-authoring/index.html");
assertIncludes(pluginAuthoring, "Built with Squidoc.", "plugin-authoring/index.html");
assert(
  pluginAuthoring.indexOf('class="sq-search" data-squidoc-search') <
    pluginAuthoring.indexOf('class="sq-sidebar"'),
  "plugin-authoring/index.html should render search before the sidebar",
);

const searchIndex = JSON.parse(await readDistFile("search-index.json"));
assert(
  Array.isArray(searchIndex) && searchIndex.length === pages.length,
  "search-index.json should include every dogfood page",
);
assert(
  pages.every((page) => searchIndex.some((entry) => entry.route === page.route)),
  "search-index.json is missing one or more dogfood routes",
);

const llms = await readDistFile("llms.txt");
assertIncludes(llms, "[MDX](https://squidoc.dev/mdx)", "llms.txt");
assertIncludes(llms, "[CLI Reference](https://squidoc.dev/cli)", "llms.txt");
assertIncludes(llms, "[Deployment](https://squidoc.dev/deployment)", "llms.txt");
assertIncludes(llms, "[Frontmatter](https://squidoc.dev/frontmatter)", "llms.txt");
assertIncludes(llms, "[Plugins](https://squidoc.dev/plugins)", "llms.txt");
assertIncludes(llms, "[Themes](https://squidoc.dev/themes)", "llms.txt");
assertIncludes(llms, "[Versioning](https://squidoc.dev/versioning)", "llms.txt");
assertIncludes(llms, "[Authoring Extensions](https://squidoc.dev/developers)", "llms.txt");
assertIncludes(llms, "[Plugin Authoring](https://squidoc.dev/plugin-authoring)", "llms.txt");
assertIncludes(llms, "[Theme Authoring](https://squidoc.dev/theme-authoring)", "llms.txt");

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
