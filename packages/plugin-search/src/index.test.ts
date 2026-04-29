import type { GeneratedFile, PluginApi, ResolvedSquidocConfig, ThemeSlot } from "@squidoc/core";
import { describe, expect, test } from "vitest";
import plugin from "./index.js";

describe("@squidoc/plugin-search", () => {
  test("generates a static search index", async () => {
    const generatedFiles: GeneratedFile[] = [];
    const themeSlots: ThemeSlot[] = [];
    const api: PluginApi = {
      addGeneratedFile(file) {
        generatedFiles.push(file);
      },
      addHeadTags() {},
      addPageHeadTags() {},
      addThemeSlot(slot) {
        themeSlots.push(slot);
      },
      config: {
        site: { name: "Test Docs" },
        docsDir: "docs",
        theme: "@squidoc/theme-basic",
        plugins: ["@squidoc/plugin-search"],
        nav: [],
      } satisfies ResolvedSquidocConfig,
      pages: [
        {
          title: "Getting Started",
          description: "Start here.",
          route: "/getting-started",
          sourcePath: "/tmp/test-docs/docs/getting-started.md",
          frontmatter: {},
          content: "# Getting Started\n\nRead the [guide](/guide) and `install` it.",
        },
      ],
    };

    await plugin.setup?.(api);

    expect(JSON.parse(generatedFiles[0]?.contents ?? "[]")).toEqual([
      {
        title: "Getting Started",
        description: "Start here.",
        route: "/getting-started",
        content: "Getting Started Read the guide and install it.",
      },
    ]);
    expect(themeSlots).toEqual([
      {
        name: "search",
        component: "@squidoc/plugin-search/Search.astro",
      },
    ]);
  });
});
