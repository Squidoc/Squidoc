#!/usr/bin/env node

import { discoverDocs, loadConfig } from "@squidoc/core";
import { buildSite, devSite, previewSite } from "./build.js";

const command = process.argv[2] ?? "help";
const commandArgs = process.argv.slice(3).filter((arg) => arg !== "--");

const messages: Record<string, string> = {
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
  if (command === "dev") {
    await runCommand(() => devSite({ astroArgs: commandArgs }));
    process.exit(0);
  }

  if (command === "build") {
    await runCommand(() => buildSite());
    process.exit(0);
  }

  if (command === "preview") {
    await runCommand(() => previewSite({ astroArgs: commandArgs }));
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

async function runCommand(command: () => Promise<void>): Promise<void> {
  try {
    await command();
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

    const routes = new Set(pages.map((page) => page.route));
    const missingNavItems = loaded.config.nav.filter((item) => !routes.has(item.path));

    if (missingNavItems.length > 0) {
      throw new Error(
        `Navigation references missing route${missingNavItems.length === 1 ? "" : "s"}: ${missingNavItems
          .map((item) => item.path)
          .join(", ")}`,
      );
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
