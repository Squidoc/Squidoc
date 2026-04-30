import type { HtmlTransformer, PluginApi, ResolvedSquidocConfig } from "@squidoc/core";
import { describe, expect, test } from "vitest";
import plugin from "./index.js";

describe("@squidoc/plugin-codeblocks", () => {
  test("highlights fenced code blocks and adds copy controls", async () => {
    const transformers: HtmlTransformer[] = [];
    const api: PluginApi = {
      addDocExtension() {},
      addGeneratedFile() {},
      addHeadTags() {},
      addHtmlTransformer(transformer) {
        transformers.push(transformer);
      },
      addPageHeadTags() {},
      addThemeSlot() {},
      config: {
        site: { name: "Test Docs" },
        docsDir: "docs",
        theme: "@squidoc/theme-basic",
        plugins: ["@squidoc/plugin-codeblocks"],
        nav: [],
      } satisfies ResolvedSquidocConfig,
      pages: [],
    };

    await plugin.setup?.(api);
    const html = await transformers[0]?.(
      '<pre><code class="language-ts">const value = &quot;squidoc&quot;;</code></pre>',
      {
        title: "Code",
        route: "/code",
        sourcePath: "/tmp/code.md",
        frontmatter: {},
        content: "",
      },
    );

    expect(html).toContain("shiki");
    expect(html).toContain("data-squidoc-codeblock");
    expect(html).toContain("data-squidoc-copy-code");
    expect(html).toContain("Copy");
    expect(html).toContain("squidoc");
    expect(html).toContain("style=");
  });
});
