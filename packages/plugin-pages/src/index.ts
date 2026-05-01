import type { Dirent } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative, sep } from "node:path";
import { type SitePageLayout, definePlugin } from "@squidoc/core";

const DEFAULT_PAGES_DIR = "pages";

export type PagesOptions = {
  pagesDir?: string;
};

export default definePlugin({
  name: "@squidoc/plugin-pages",
  async setup(api) {
    const pagesDir = readString(api.pluginOptions.pagesDir) ?? DEFAULT_PAGES_DIR;
    const root = join(api.cwd, pagesDir);
    const files = await listAstroFiles(root);

    for (const file of files) {
      const source = await readFile(file, "utf8");
      const metadata = readPageMetadata(source);

      api.addSitePage({
        sourcePath: file,
        sourceRoot: root,
        route: routeFromFilePath(file, root),
        layout: metadata.layout,
        title: metadata.title,
        description: metadata.description,
      });
    }
  },
});

async function listAstroFiles(directory: string): Promise<string[]> {
  let entries: Dirent[];

  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return [];
    }

    throw error;
  }

  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);

      if (entry.isDirectory()) {
        return listAstroFiles(path);
      }

      if (entry.isFile() && extname(entry.name) === ".astro") {
        return [path];
      }

      return [];
    }),
  );

  return files.flat().sort();
}

function routeFromFilePath(filePath: string, pagesRoot: string): string {
  const normalized = relative(pagesRoot, filePath).split(sep).join("/");
  const withoutExtension = normalized.replace(/\.astro$/, "");
  const withoutIndex = withoutExtension.replace(/(^|\/)index$/, "$1");
  const route = `/${withoutIndex}`.replace(/\/+$/, "");

  return route === "" ? "/" : route;
}

function readPageMetadata(source: string): {
  layout: SitePageLayout;
  title?: string;
  description?: string;
} {
  const exportMatch = source.match(/export\s+const\s+squidoc\s*=\s*\{([\s\S]*?)\}/m);
  const objectBody = exportMatch?.[1] ?? "";
  const layout = readProperty(objectBody, "layout");

  return {
    layout: layout === "docs" ? "docs" : "page",
    title: readProperty(objectBody, "title"),
    description: readProperty(objectBody, "description"),
  };
}

function readProperty(source: string, property: string): string | undefined {
  const match = source.match(new RegExp(`${property}\\s*:\\s*(["'])((?:\\\\.|(?!\\1).)*)\\1`, "m"));
  return match?.[2];
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
