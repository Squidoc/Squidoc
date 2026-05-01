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
      addProjectTransformer() {},
      addSitePage() {},
      addThemeSlot(slot) {
        themeSlots.push(slot);
      },
      config: {
        site: { name: "Test Docs" },
        docs: { basePath: "/docs" },
        docsDir: "docs",
        theme: "@squidoc/theme-basic",
        plugins: ["@squidoc/plugin-article-tree"],
        nav: [],
      } satisfies ResolvedSquidocConfig,
      cwd: "/tmp/test-docs",
      pages: [],
      pluginOptions: {},
    };

    await plugin.setup?.(api);

    expect(themeSlots[0]).toMatchObject({
      name: "article-tree",
      component: "@squidoc/plugin-article-tree/ArticleTree.astro",
    });
    expect(themeSlots[0]?.html).toContain("data-squidoc-article-tree");
    expect(themeSlots[0]?.html).toContain("IntersectionObserver");
    expect(themeSlots[0]?.html).toContain("requestAnimationFrame");
    expect(themeSlots[0]?.html).toContain("isAtBottom");
  });
});
