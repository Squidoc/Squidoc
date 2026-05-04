import { readdir } from "node:fs/promises";
import { join, relative } from "node:path";

const repoRoot = new URL("..", import.meta.url).pathname;
const docsRoot = join(repoRoot, "examples/squidoc-docs/docs");
const locales = ["es", "de", "fr", "ja", "zh-CN", "pt-BR"];
const versions = ["versions/0.1"];
const ignoredTopLevel = new Set(["versions", ...locales]);

const englishRoutes = await routeSet(
  docsRoot,
  (segments) => !ignoredTopLevel.has(segments[0] ?? ""),
);
const failures = [];

for (const version of versions) {
  const versionRoutes = await routeSet(join(docsRoot, version));
  compareRouteSets(`English ${version}`, englishRoutes, versionRoutes);
}

for (const locale of locales) {
  const localeRoutes = await routeSet(
    join(docsRoot, locale),
    (segments) => segments[0] !== "versions",
  );
  compareRouteSets(locale, englishRoutes, localeRoutes);

  for (const version of versions) {
    const localizedVersionRoutes = await routeSet(join(docsRoot, locale, version));
    compareRouteSets(`${locale} ${version}`, englishRoutes, localizedVersionRoutes);
  }
}

if (failures.length > 0) {
  throw new Error(`Localized docs are out of sync:\n${failures.join("\n")}`);
}

console.log("Localized docs coverage is in sync.");

async function routeSet(root, include = () => true) {
  const files = await listDocs(root);
  return new Set(
    files
      .map((file) => relative(root, file).split("/"))
      .filter(include)
      .map(routeFromSegments)
      .sort(),
  );
}

async function listDocs(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);

      if (entry.isDirectory()) {
        return listDocs(path);
      }

      return /\.(md|mdx)$/.test(entry.name) ? [path] : [];
    }),
  );

  return files.flat();
}

function routeFromSegments(segments) {
  const file = segments.join("/").replace(/\.(md|mdx)$/, "");
  const route = file === "index" ? "/" : `/${file.replace(/\/index$/, "")}`;

  return route;
}

function compareRouteSets(label, expected, actual) {
  const missing = [...expected].filter((route) => !actual.has(route));
  const extra = [...actual].filter((route) => !expected.has(route));

  if (missing.length > 0) {
    failures.push(`${label} is missing: ${missing.join(", ")}`);
  }

  if (extra.length > 0) {
    failures.push(`${label} has extra routes: ${extra.join(", ")}`);
  }
}
