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
      addProjectTransformer() {},
      addSitePage() {},
      addThemeSlot() {},
      config: {
        site: { name: "Test Docs" },
        docs: { basePath: "/docs" },
        docsDir: "docs",
        theme: "@squidoc/theme-basic",
        plugins: ["@squidoc/plugin-codeblocks"],
        nav: [],
      } satisfies ResolvedSquidocConfig,
      cwd: "/tmp/test-docs",
      pages: [],
      pluginOptions: {},
    };

    await plugin.setup?.(api);
    const html = await transformers[0]?.(
      '<pre><code class="language-ts">const value = &quot;squidoc&quot;;</code></pre>',
      {
        title: "Code",
        route: "/code",
        docsRoute: "/code",
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

  test("decodes numeric html entities before highlighting", async () => {
    const transformers: HtmlTransformer[] = [];
    const api: PluginApi = {
      addDocExtension() {},
      addGeneratedFile() {},
      addHeadTags() {},
      addHtmlTransformer(transformer) {
        transformers.push(transformer);
      },
      addPageHeadTags() {},
      addProjectTransformer() {},
      addSitePage() {},
      addThemeSlot() {},
      config: {
        site: { name: "Test Docs" },
        docs: { basePath: "/docs" },
        docsDir: "docs",
        theme: "@squidoc/theme-basic",
        plugins: ["@squidoc/plugin-codeblocks"],
        nav: [],
      } satisfies ResolvedSquidocConfig,
      cwd: "/tmp/test-docs",
      pages: [],
      pluginOptions: {},
    };

    await plugin.setup?.(api);
    const html = await transformers[0]?.(
      '<pre><code class="language-ts">html: &quot;&#x3C;div data-squidoc-search&gt;...&#x3C;/div&gt;&quot;,</code></pre>',
      {
        title: "Code",
        route: "/code",
        docsRoute: "/code",
        sourcePath: "/tmp/code.md",
        frontmatter: {},
        content: "",
      },
    );

    expect(html).not.toContain("&#x26;#x3C;");
    expect(html).toContain("&#x3C;div");
    expect(html).toContain("&#x3C;/div>");
  });

  test("uses a configured shiki theme", async () => {
    const transformers: HtmlTransformer[] = [];
    const api: PluginApi = {
      addDocExtension() {},
      addGeneratedFile() {},
      addHeadTags() {},
      addHtmlTransformer(transformer) {
        transformers.push(transformer);
      },
      addPageHeadTags() {},
      addProjectTransformer() {},
      addSitePage() {},
      addThemeSlot() {},
      config: {
        site: { name: "Test Docs" },
        docs: { basePath: "/docs" },
        docsDir: "docs",
        theme: "@squidoc/theme-basic",
        plugins: ["@squidoc/plugin-codeblocks"],
        nav: [],
      } satisfies ResolvedSquidocConfig,
      cwd: "/tmp/test-docs",
      pages: [],
      pluginOptions: { theme: "github-dark" },
    };

    await plugin.setup?.(api);
    const html = await transformers[0]?.(
      '<pre><code class="language-ts">const value = 1;</code></pre>',
      {
        title: "Code",
        route: "/code",
        docsRoute: "/code",
        sourcePath: "/tmp/code.md",
        frontmatter: {},
        content: "",
      },
    );

    expect(html).toContain("github-dark");
    expect(html).toContain("background-color:#24292e");
  });
});
