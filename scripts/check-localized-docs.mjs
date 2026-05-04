import { readFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";

const repoRoot = new URL("..", import.meta.url).pathname;
const docsRoot = join(repoRoot, "examples/squidoc-docs/docs");
const locales = ["es", "de", "fr", "ja", "zh-CN", "pt-BR"];
const versions = ["versions/0.1"];
const ignoredTopLevel = new Set(["versions", ...locales]);
const blockedLocalizedPhrases = [
  "Squidoc ist eine statische Dokumentationsplattform mit Plugins",
  "## Projektstruktur",
  "## Erweitern",
  "## Verifizieren",
  "Diese Seite folgt der englischen Dokumentation",
  "Cette page suit la documentation anglaise",
  "Esta página acompanha a documentação em inglês",
  "Esta página acompaña la documentación en inglés",
  "このページは英語版ドキュメントに対応",
  "此页面与英文文档保持对应",
  "This page follows the English documentation",
];

const englishDocs = await docsMap(docsRoot, (segments) => !ignoredTopLevel.has(segments[0] ?? ""));
const englishRoutes = new Set(englishDocs.keys());
const failures = [];

for (const version of versions) {
  const versionDocs = await docsMap(join(docsRoot, version));
  compareDocs(`English ${version}`, englishDocs, versionDocs);
}

for (const locale of locales) {
  const localeDocs = await docsMap(
    join(docsRoot, locale),
    (segments) => segments[0] !== "versions",
  );
  compareDocs(locale, englishDocs, localeDocs);
  checkLocalizedContent(locale, localeDocs);

  for (const version of versions) {
    const localizedVersionDocs = await docsMap(join(docsRoot, locale, version));
    compareDocs(`${locale} ${version}`, englishDocs, localizedVersionDocs);
    checkLocalizedContent(`${locale} ${version}`, localizedVersionDocs);
  }
}

if (failures.length > 0) {
  throw new Error(`Localized docs are out of sync:\n${failures.join("\n")}`);
}

console.log("Localized docs coverage is in sync.");

async function docsMap(root, include = () => true) {
  const files = await listDocs(root);
  const docs = await Promise.all(
    files
      .map((file) => ({ file, segments: relative(root, file).split("/") }))
      .filter(({ segments }) => include(segments))
      .map(async ({ file, segments }) => {
        const content = await readFile(file, "utf8");
        return [
          routeFromSegments(segments),
          {
            content,
            codeBlockCount: codeBlockCount(content),
          },
        ];
      }),
  );

  return new Map(docs);
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

function compareDocs(label, expected, actual) {
  const missing = [...expected.keys()].filter((route) => !actual.has(route));
  const extra = [...actual.keys()].filter((route) => !expected.has(route));

  if (missing.length > 0) {
    failures.push(`${label} is missing: ${missing.join(", ")}`);
  }

  if (extra.length > 0) {
    failures.push(`${label} has extra routes: ${extra.join(", ")}`);
  }

  for (const [route, expectedMetrics] of expected) {
    const actualMetrics = actual.get(route);

    if (!actualMetrics) {
      continue;
    }

    if (actualMetrics.codeBlockCount !== expectedMetrics.codeBlockCount) {
      failures.push(
        `${label} ${route} has ${actualMetrics.codeBlockCount} code blocks; expected ${expectedMetrics.codeBlockCount}`,
      );
    }
  }
}

function checkLocalizedContent(label, docs) {
  for (const [route, metrics] of docs) {
    const blockedPhrase = blockedLocalizedPhrases.find((phrase) =>
      metrics.content.includes(phrase),
    );

    if (blockedPhrase) {
      failures.push(`${label} ${route} contains localized placeholder copy: "${blockedPhrase}"`);
    }
  }
}

function codeBlockCount(value) {
  return (value.match(/```[\s\S]*?```/g) ?? []).length;
}
