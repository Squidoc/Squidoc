import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { discoverDocs, routeFromFilePath } from "./docs.js";
import { resolveConfig } from "./schema.js";

describe("discoverDocs", () => {
  test("discovers markdown pages and reads frontmatter", async () => {
    const cwd = join(process.cwd(), ".tmp", `docs-${Date.now()}`);
    await mkdir(join(cwd, "docs", "guides"), { recursive: true });
    await writeFile(
      join(cwd, "docs", "index.md"),
      `---
title: Home
description: Welcome home.
---

# Ignored Heading
`,
    );
    await writeFile(
      join(cwd, "docs", "guides", "getting-started.md"),
      `# Getting Started

Hello.
`,
    );

    const pages = await discoverDocs(resolveConfig({ site: { name: "Test" } }), cwd);

    expect(pages.map((page) => page.route)).toEqual(["/", "/guides/getting-started"]);
    expect(pages[0]).toMatchObject({
      title: "Home",
      description: "Welcome home.",
    });
    expect(pages[1]).toMatchObject({
      title: "Getting Started",
      content: "# Getting Started\n\nHello.",
    });
  });
});

describe("routeFromFilePath", () => {
  test("maps index files to directory routes", () => {
    expect(routeFromFilePath("/repo/docs/index.md", "/repo/docs")).toBe("/");
    expect(routeFromFilePath("/repo/docs/guide/index.md", "/repo/docs")).toBe("/guide");
  });
});
