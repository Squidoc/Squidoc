import type { Dirent } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative, sep } from "node:path";
import { type SitePageLayout, definePlugin } from "@squidoc/core";

const DEFAULT_PAGES_DIR = "pages";
const RESERVED_ROUTES = new Set(["/404", "/500"]);

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
      const route = routeFromFilePath(file, root);
      validatePageRoute(file, root, route);
      const metadata = readPageMetadata(source, file);

      api.addSitePage({
        sourcePath: file,
        sourceRoot: root,
        route,
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
};
function readPageMetadata(
  source: string,
  filePath: string,
): {
  layout: SitePageLayout;
  title?: string;
  description?: string;
};
function readPageMetadata(
  source: string,
  filePath = "page",
): {
  layout: SitePageLayout;
  title?: string;
  description?: string;
} {
  const hasMetadataExport = /export\s+const\s+squidoc\b/.test(source);
  const exportMatch = source.match(/export\s+const\s+squidoc\s*=\s*\{([\s\S]*?)\}/m);
  const objectBody = exportMatch?.[1] ?? "";
  const layout = readProperty(objectBody, "layout", filePath);

  if (hasMetadataExport && !exportMatch) {
    console.warn(
      `Could not parse Squidoc page metadata in ${filePath}. Use a plain export like: export const squidoc = { title: "Page title" };`,
    );
  }

  if (layout && layout !== "docs" && layout !== "page") {
    console.warn(
      `Unsupported Squidoc page layout "${layout}" in ${filePath}. Falling back to the "page" layout.`,
    );
  }

  return {
    layout: layout === "docs" ? "docs" : "page",
    title: readProperty(objectBody, "title", filePath),
    description: readProperty(objectBody, "description", filePath),
  };
}

function readProperty(source: string, property: string, filePath: string): string | undefined {
  const match = source.match(new RegExp(`${property}\\s*:\\s*(["'])((?:\\\\.|(?!\\1).)*)\\1`, "m"));

  if (match?.[2]) {
    return match[2];
  }

  if (new RegExp(`${property}\\s*:`).test(source)) {
    console.warn(
      `Could not parse Squidoc page metadata property "${property}" in ${filePath}. Use a string literal value.`,
    );
  }

  return undefined;
}

function validatePageRoute(filePath: string, pagesRoot: string, route: string): void {
  const relativePath = relative(pagesRoot, filePath).split(sep).join("/");

  if (relativePath.split("/").some(isDynamicRouteSegment)) {
    throw new Error(
      `Dynamic Astro page routes are not supported by @squidoc/plugin-pages: ${relativePath}. Create explicit .astro files instead.`,
    );
  }

  if (RESERVED_ROUTES.has(route)) {
    throw new Error(
      `Reserved Astro page routes are not supported by @squidoc/plugin-pages: ${relativePath} publishes ${route}.`,
    );
  }
}

function isDynamicRouteSegment(segment: string): boolean {
  return segment.startsWith("[") || segment.includes("/[");
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
