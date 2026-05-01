import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { PluginApi, ResolvedSquidocConfig, SitePage } from "@squidoc/core";
import { describe, expect, test, vi } from "vitest";
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

  test("uses a configured pagesDir", async () => {
    const cwd = join(process.cwd(), ".tmp", `custom-pages-${Date.now()}`);
    const sitePages: SitePage[] = [];

    await mkdir(join(cwd, "custom-pages"), { recursive: true });
    await writeFile(
      join(cwd, "custom-pages", "index.astro"),
      `---
export const squidoc = { title: "Custom Home" };
---

<h1>Custom Home</h1>
`,
    );

    await plugin.setup?.(createApi(cwd, sitePages, { pagesDir: "custom-pages" }));

    expect(sitePages).toEqual([
      {
        sourcePath: join(cwd, "custom-pages", "index.astro"),
        sourceRoot: join(cwd, "custom-pages"),
        route: "/",
        layout: "page",
        title: "Custom Home",
        description: undefined,
      },
    ]);

    await rm(cwd, { recursive: true, force: true });
  });

  test("rejects unsupported dynamic and reserved routes", async () => {
    const dynamicCwd = join(process.cwd(), ".tmp", `dynamic-pages-${Date.now()}`);
    const reservedCwd = join(process.cwd(), ".tmp", `reserved-pages-${Date.now()}`);

    await mkdir(join(dynamicCwd, "pages"), { recursive: true });
    await writeFile(join(dynamicCwd, "pages", "[slug].astro"), "<h1>Dynamic</h1>");

    await expect(plugin.setup?.(createApi(dynamicCwd, []))).rejects.toThrow(
      "Dynamic Astro page routes are not supported",
    );

    await mkdir(join(reservedCwd, "pages"), { recursive: true });
    await writeFile(join(reservedCwd, "pages", "404.astro"), "<h1>Not found</h1>");

    await expect(plugin.setup?.(createApi(reservedCwd, []))).rejects.toThrow(
      "Reserved Astro page routes are not supported",
    );

    await rm(dynamicCwd, { recursive: true, force: true });
    await rm(reservedCwd, { recursive: true, force: true });
  });

  test("warns when page metadata cannot be parsed", async () => {
    const cwd = join(process.cwd(), ".tmp", `metadata-pages-${Date.now()}`);
    const sitePages: SitePage[] = [];
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    await mkdir(join(cwd, "pages"), { recursive: true });
    await writeFile(
      join(cwd, "pages", "index.astro"),
      `---
const pageTitle = "Home";
export const squidoc = {
  title: pageTitle,
  layout: "sideways",
};
---

<h1>Home</h1>
`,
    );

    await plugin.setup?.(createApi(cwd, sitePages));

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('property "title"'));
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('layout "sideways"'));
    expect(sitePages[0]).toMatchObject({
      route: "/",
      layout: "page",
      title: undefined,
    });

    warn.mockRestore();
    await rm(cwd, { recursive: true, force: true });
  });
});

function createApi(
  cwd: string,
  sitePages: SitePage[],
  pluginOptions: Record<string, unknown> = {},
): PluginApi {
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
    pluginOptions,
  };
}
