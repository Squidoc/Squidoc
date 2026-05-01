import type { GeneratedFile, PluginApi, ResolvedSquidocConfig, ThemeSlot } from "@squidoc/core";
import { describe, expect, test } from "vitest";
import plugin from "./index.js";

describe("@squidoc/plugin-llms", () => {
  test("generates llms.txt and llms-full.txt from discovered pages", async () => {
    const generatedFiles: GeneratedFile[] = [];
    const api: PluginApi = {
      addGeneratedFile(file) {
        generatedFiles.push(file);
      },
      addDocExtension() {},
      addHeadTags() {},
      addHtmlTransformer() {},
      addPageHeadTags() {},
      addProjectTransformer() {},
      addSitePage() {},
      addThemeSlot(_slot: ThemeSlot) {},
      config: {
        site: {
          name: "Test Docs",
          url: "https://docs.example.com",
          description: "Helpful docs.",
        },
        docs: { basePath: "/docs" },
        docsDir: "docs",
        theme: "@squidoc/theme-basic",
        plugins: ["@squidoc/plugin-llms"],
        nav: [],
      } satisfies ResolvedSquidocConfig,
      cwd: "/tmp/test-docs",
      pages: [
        {
          title: "Guide",
          description: "A deeper guide.",
          route: "/guide",
          docsRoute: "/guide",
          sourcePath: "/tmp/test-docs/docs/guide.md",
          frontmatter: {},
          content: "# Guide\n\nRead this.",
        },
      ],
      pluginOptions: {},
    };

    await plugin.setup?.(api);

    expect(generatedFiles).toEqual([
      {
        path: "llms.txt",
        contents:
          "# Test Docs\n\nHelpful docs.\n\n## Docs\n- [Guide](https://docs.example.com/guide) - A deeper guide.\n",
      },
      {
        path: "llms-full.txt",
        contents:
          "# Test Docs\n\nHelpful docs.\n\n---\n\n# Guide\n\nA deeper guide.\n\nSource: https://docs.example.com/guide\n\n# Guide\n\nRead this.\n",
      },
    ]);
  });
});
