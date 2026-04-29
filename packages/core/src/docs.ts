import { readFile, readdir } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import matter from "gray-matter";
import type { ResolvedSquidocConfig } from "./schema.js";

const MARKDOWN_EXTENSIONS = new Set([".md"]);

export type DocPage = {
  sourcePath: string;
  route: string;
  title: string;
  description?: string;
  frontmatter: Record<string, unknown>;
  content: string;
};

export async function discoverDocs(
  config: ResolvedSquidocConfig,
  cwd = process.cwd(),
): Promise<DocPage[]> {
  const docsRoot = join(cwd, config.docsDir);
  const files = await listMarkdownFiles(docsRoot);
  const pages = await Promise.all(files.map((file) => readDocPage(file, docsRoot)));

  return pages.sort((first, second) => first.route.localeCompare(second.route));
}

async function listMarkdownFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);

      if (entry.isDirectory()) {
        return listMarkdownFiles(path);
      }

      if (entry.isFile() && MARKDOWN_EXTENSIONS.has(getExtension(entry.name))) {
        return [path];
      }

      return [];
    }),
  );

  return files.flat();
}

async function readDocPage(filePath: string, docsRoot: string): Promise<DocPage> {
  const raw = await readFile(filePath, "utf8");
  const parsed = matter(raw);
  const frontmatter = parsed.data;

  return {
    sourcePath: filePath,
    route: routeFromFilePath(filePath, docsRoot),
    title:
      readString(frontmatter.title) ??
      titleFromContent(parsed.content) ??
      titleFromFilePath(filePath),
    description: readString(frontmatter.description),
    frontmatter,
    content: parsed.content.trim(),
  };
}

export function routeFromFilePath(filePath: string, docsRoot: string): string {
  const normalized = relative(docsRoot, filePath).split(sep).join("/");
  const withoutExtension = normalized.replace(/\.md$/, "");
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

function getExtension(filename: string): string {
  const index = filename.lastIndexOf(".");
  return index === -1 ? "" : filename.slice(index);
}
