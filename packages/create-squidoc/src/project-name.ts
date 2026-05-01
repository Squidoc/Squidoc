import { basename, resolve } from "node:path";

export function getProjectPackageName(targetDir: string): string {
  const name = basename(resolve(targetDir))
    .trim()
    .toLowerCase()
    .replace(/^@+/, "")
    .replace(/[^a-z0-9._~-]+/g, "-")
    .replace(/^[._-]+/, "")
    .replace(/[._-]+$/, "");

  return name || "squidoc-docs";
}
