import type { PluginApi, ResolvedSquidocConfig, ThemeSlot } from "@squidoc/core";
import { describe, expect, test } from "vitest";
import plugin from "./index.js";

describe("@squidoc/plugin-article-tree", () => {
  test("registers an article tree theme slot", async () => {
    const themeSlots: ThemeSlot[] = [];
    const api: PluginApi = {
      addDocExtension() {},
      addGeneratedFile() {},
      addHeadTags() {},
      addHtmlTransformer() {},
      addPageHeadTags() {},
      addThemeSlot(slot) {
        themeSlots.push(slot);
      },
      config: {
        site: { name: "Test Docs" },
        docsDir: "docs",
        theme: "@squidoc/theme-basic",
        plugins: ["@squidoc/plugin-article-tree"],
        nav: [],
      } satisfies ResolvedSquidocConfig,
      pages: [],
    };

    await plugin.setup?.(api);

    expect(themeSlots[0]).toMatchObject({
      name: "article-tree",
      component: "@squidoc/plugin-article-tree/ArticleTree.astro",
    });
    expect(themeSlots[0]?.html).toContain("data-squidoc-article-tree");
    expect(themeSlots[0]?.html).toContain("IntersectionObserver");
  });
});
