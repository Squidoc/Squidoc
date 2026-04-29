#!/usr/bin/env node

import { discoverDocs, loadConfig } from "@squidoc/core";
import { buildSite } from "./build.js";

const command = process.argv[2] ?? "help";

const messages: Record<string, string> = {
  dev: "Starting the Squidoc dev server is coming next. This command will wrap Astro dev.",
  preview:
    "Previewing the static Squidoc site is coming next. This command will wrap Astro preview.",
  doctor: "Inspecting the local Squidoc environment is coming next.",
};

if (command === "help" || command === "--help" || command === "-h") {
  console.log(`squidoc

Usage:
  squidoc dev
  squidoc build
  squidoc preview
  squidoc check
  squidoc doctor
  squidoc add plugin <name>
  squidoc add theme <name>
`);
  process.exit(0);
}

if (command === "add") {
  const kind = process.argv[3];
  const name = process.argv[4];

  if (!kind || !name || !["plugin", "theme"].includes(kind)) {
    console.error("Usage: squidoc add plugin <name> OR squidoc add theme <name>");
    process.exit(1);
  }

  console.log(`Adding ${kind} "${name}" is coming next.`);
  process.exit(0);
}

const message = messages[command];

if (!message) {
  if (command === "build") {
    await runBuild();
    process.exit(0);
  }

  if (command === "check") {
    await checkProject();
    process.exit(0);
  }

  console.error(`Unknown command: ${command}`);
  process.exit(1);
}

console.log(message);

async function runBuild(): Promise<void> {
  try {
    await buildSite();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

async function checkProject(): Promise<void> {
  try {
    const loaded = await loadConfig();
    const pages = await discoverDocs(loaded.config);

    console.log(`Loaded config: ${loaded.path}`);
    console.log(`Discovered ${pages.length} Markdown page${pages.length === 1 ? "" : "s"}.`);

    if (pages.length === 0) {
      throw new Error(`No Markdown pages found in ${loaded.config.docsDir}.`);
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
