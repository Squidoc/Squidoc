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
    file: "architecture/index.html",
    route: "/architecture",
    title: "Architecture | Squidoc",
    canonical: "https://squidoc.dev/architecture",
  },
  {
    file: "configuration/index.html",
    route: "/configuration",
    title: "Configuration | Squidoc",
    canonical: "https://squidoc.dev/configuration",
  },
  {
    file: "getting-started/index.html",
    route: "/getting-started",
    title: "Getting Started | Squidoc",
    canonical: "https://squidoc.dev/getting-started",
  },
  {
    file: "mdx/index.html",
    route: "/mdx",
    title: "MDX | Squidoc",
    canonical: "https://squidoc.dev/mdx",
  },
  {
    file: "testing/index.html",
    route: "/testing",
    title: "Testing | Squidoc",
    canonical: "https://squidoc.dev/testing",
  },
];

for (const page of pages) {
  const html = await readDistFile(page.file);

  assertIncludes(html, `<title>${page.title}</title>`, page.file);
  assertIncludes(html, `rel="canonical" href="${page.canonical}"`, page.file);
  assertIncludes(html, "data-squidoc-search", page.file);
  assertIncludes(html, `href="${page.route}"`, page.file);
}

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
assertIncludes(llms, "[Architecture](https://squidoc.dev/architecture)", "llms.txt");
assertIncludes(llms, "[Testing](https://squidoc.dev/testing)", "llms.txt");

const llmsFull = await readDistFile("llms-full.txt");
assertIncludes(llmsFull, "This page is written as an MDX file", "llms-full.txt");
assertIncludes(llmsFull, "The generated-site smoke test checks for page titles", "llms-full.txt");

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
