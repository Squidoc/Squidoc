import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { PluginApi, ResolvedSquidocConfig, SitePage } from "@squidoc/core";
import { describe, expect, test } from "vitest";
import plugin from "./index.js";

describe("@squidoc/plugin-pages", () => {
  test("registers Astro pages with page layout by default", async () => {
    const cwd = join(process.cwd(), ".tmp", `pages-${Date.now()}`);
    const sitePages: SitePage[] = [];

    await mkdir(join(cwd, "pages", "changelog"), { recursive: true });
    await writeFile(
      join(cwd, "pages", "index.astro"),
      `---
export const squidoc = {
  title: "Home",
  description: "A custom homepage"
};
---

<h1>Home</h1>
`,
    );
    await writeFile(
      join(cwd, "pages", "changelog", "index.astro"),
      `---
export const squidoc = { layout: "docs", title: "Changelog" };
---

<h1>Changelog</h1>
`,
    );

    await plugin.setup?.(createApi(cwd, sitePages));

    expect(sitePages).toEqual([
      {
        sourcePath: join(cwd, "pages", "changelog", "index.astro"),
        sourceRoot: join(cwd, "pages"),
        route: "/changelog",
        layout: "docs",
        title: "Changelog",
        description: undefined,
      },
      {
        sourcePath: join(cwd, "pages", "index.astro"),
        sourceRoot: join(cwd, "pages"),
        route: "/",
        layout: "page",
        title: "Home",
        description: "A custom homepage",
      },
    ]);
  });
});

function createApi(cwd: string, sitePages: SitePage[]): PluginApi {
  return {
    addDocExtension() {},
    addGeneratedFile() {},
    addHeadTags() {},
    addHtmlTransformer() {},
    addPageHeadTags() {},
    addProjectTransformer() {},
    addSitePage(page) {
      sitePages.push(page);
    },
    addThemeSlot() {},
    config: {
      site: { name: "Test Docs" },
      docs: { basePath: "/docs" },
      docsDir: "docs",
      theme: "@squidoc/theme-basic",
      plugins: ["@squidoc/plugin-pages"],
      nav: [],
    } satisfies ResolvedSquidocConfig,
    cwd,
    pages: [],
    pluginOptions: {},
  };
}
