import type {
  GeneratedFile,
  HeadTag,
  PluginApi,
  ResolvedSquidocConfig,
  ThemeSlot,
} from "@squidoc/core";
import { describe, expect, test } from "vitest";
import plugin from "./index.js";

describe("@squidoc/plugin-seo", () => {
  test("registers favicon tags and generated SEO files", async () => {
    const generatedFiles: GeneratedFile[] = [];
    const headTags: HeadTag[] = [];
    const api: PluginApi = {
      addDocExtension() {},
      addGeneratedFile(file) {
        generatedFiles.push(file);
      },
      addHeadTags(tags) {
        headTags.push(...tags);
      },
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
        plugins: ["@squidoc/plugin-seo"],
        nav: [],
      } satisfies ResolvedSquidocConfig,
      cwd: "/tmp/test-docs",
      pages: [
        {
          title: "Guide",
          route: "/docs/guide",
          docsRoute: "/guide",
          sourcePath: "/tmp/test-docs/docs/guide.md",
          frontmatter: {},
          content: "# Guide",
        },
      ],
      pluginOptions: {},
    };

    await plugin.setup?.(api);

    expect(headTags).toEqual([
      {
        tag: "link",
        attrs: { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      },
      {
        tag: "link",
        attrs: { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      },
      {
        tag: "link",
        attrs: { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      },
      { tag: "link", attrs: { rel: "manifest", href: "/site.webmanifest" } },
      { tag: "link", attrs: { rel: "shortcut icon", href: "/favicon.ico" } },
    ]);
    expect(generatedFiles.some((file) => file.path === "robots.txt")).toBe(true);
    expect(generatedFiles.some((file) => file.path === "sitemap.xml")).toBe(true);
  });
});
