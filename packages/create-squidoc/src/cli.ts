#!/usr/bin/env node

import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const targetDir = process.argv[2] ?? "my-docs";
const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const templateDir = join(packageRoot, "template");

async function copyTemplate(from: string, to: string): Promise<void> {
  await mkdir(to, { recursive: true });
  const entries = await readdir(from, { withFileTypes: true });

  for (const entry of entries) {
    const source = join(from, entry.name);
    const destination = join(to, entry.name);

    if (entry.isDirectory()) {
      await copyTemplate(source, destination);
      continue;
    }

    const contents = await readFile(source, "utf8");
    await writeFile(destination, contents);
  }
}

await copyTemplate(templateDir, targetDir);
console.log(`Created Squidoc project in ${targetDir}`);
console.log("");
console.log("Next steps:");
console.log(`  cd ${targetDir}`);
console.log("  pnpm install");
console.log("  pnpm dev");
