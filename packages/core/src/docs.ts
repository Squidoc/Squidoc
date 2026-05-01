import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative, sep } from "node:path";
import matter from "gray-matter";
import type { NavItem, ResolvedSquidocConfig } from "./schema.js";

const DEFAULT_DOC_EXTENSIONS = [".md"];

export type DiscoverDocsOptions = {
  extensions?: string[];
};

export type DocPage = {
  sourcePath: string;
  route: string;
  docsRoute: string;
  title: string;
  description?: string;
  frontmatter: Record<string, unknown>;
  nav?: NavItem[];
  content: string;
};

export async function discoverDocs(
  config: ResolvedSquidocConfig,
  cwd = process.cwd(),
  options: DiscoverDocsOptions = {},
): Promise<DocPage[]> {
  const docsRoot = join(cwd, config.docsDir);
  const extensions = new Set([...DEFAULT_DOC_EXTENSIONS, ...(options.extensions ?? [])]);
  const files = await listDocFiles(docsRoot, extensions);
  const pages = await Promise.all(
    files.map((file) => readDocPage(file, docsRoot, config.docs.basePath)),
  );

  return pages.sort((first, second) => first.route.localeCompare(second.route));
}

async function listDocFiles(directory: string, extensions: Set<string>): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);

      if (entry.isDirectory()) {
        return listDocFiles(path, extensions);
      }

      if (entry.isFile() && extensions.has(extname(entry.name))) {
        return [path];
      }

      return [];
    }),
  );

  return files.flat();
}

async function readDocPage(
  filePath: string,
  docsRoot: string,
  docsBasePath: string,
): Promise<DocPage> {
  const raw = await readFile(filePath, "utf8");
  const parsed = matter(raw);
  const frontmatter = parsed.data;
  const docsRoute = routeFromFilePath(filePath, docsRoot);

  return {
    sourcePath: filePath,
    route: joinRoutes(docsBasePath, docsRoute),
    docsRoute,
    title:
      readString(frontmatter.title) ??
      titleFromContent(parsed.content) ??
      titleFromFilePath(filePath),
    description: readString(frontmatter.description),
    frontmatter,
    content: parsed.content.trim(),
  };
}

function joinRoutes(prefix: string, remainder: string): string {
  const normalizedPrefix = normalizeRoutePath(prefix);
  const cleanRemainder = stripLeadingSlash(remainder).replace(/\/+$/, "");

  if (!cleanRemainder) {
    return normalizedPrefix;
  }

  return `${normalizedPrefix === "/" ? "" : normalizedPrefix}/${cleanRemainder}`;
}

function normalizeRoutePath(value: string): string {
  const prefixed = value.startsWith("/") ? value : `/${value}`;
  const withoutTrailingSlash = prefixed.replace(/\/+$/, "");

  return withoutTrailingSlash === "" ? "/" : withoutTrailingSlash;
}

function stripLeadingSlash(value: string): string {
  return value.replace(/^\/+/, "");
}

export function routeFromFilePath(filePath: string, docsRoot: string): string {
  const normalized = relative(docsRoot, filePath).split(sep).join("/");
  const extension = extname(normalized);
  const withoutExtension = extension ? normalized.slice(0, -extension.length) : normalized;
  const withoutIndex = withoutExtension.replace(/(^|\/)index$/, "$1");
  const route = `/${withoutIndex}`.replace(/\/+$/, "");

  return route === "" ? "/" : route;
}

function titleFromContent(content: string): string | undefined {
  const heading = content.match(/^#\s+(.+)$/m);
  return heading?.[1]?.trim();
}

function titleFromFilePath(filePath: string): string {
  const filename = filePath.split(sep).at(-1)?.replace(/\.md$/, "") ?? "Untitled";
  return filename
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}
