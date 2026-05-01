import type { PluginApi, ResolvedSquidocConfig } from "@squidoc/core";
import { describe, expect, test } from "vitest";
import plugin from "./index.js";

describe("@squidoc/plugin-mdx", () => {
  test("registers the mdx document extension", async () => {
    const extensions: string[] = [];
    const api: PluginApi = {
      addDocExtension(extension) {
        extensions.push(extension);
      },
      addGeneratedFile() {},
      addHeadTags() {},
      addHtmlTransformer() {},
      addPageHeadTags() {},
      addProjectTransformer() {},
      addSitePage() {},
      addThemeSlot() {},
      config: {
        site: { name: "Test Docs" },
        docs: { basePath: "/docs" },
        docsDir: "docs",
        theme: "@squidoc/theme-basic",
        plugins: ["@squidoc/plugin-mdx"],
        nav: [],
      } satisfies ResolvedSquidocConfig,
      cwd: "/tmp/test-docs",
      pages: [],
      pluginOptions: {},
    };

    await plugin.setup?.(api);

    expect(extensions).toEqual([".mdx"]);
  });
});
