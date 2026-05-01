import type {
  GeneratedFile,
  NavItem,
  PluginApi,
  ProjectTransformer,
  ResolvedSquidocConfig,
  ThemeSlot,
} from "@squidoc/core";
import { describe, expect, test } from "vitest";
import plugin from "./index.js";

describe("@squidoc/plugin-versions", () => {
  test("rewrites archived version routes and annotates page frontmatter", async () => {
    const { transformers, generatedFiles, slots } = await setupPlugin({
      current: { name: "1.0", label: "1.0" },
      versions: [{ name: "0.9", label: "0.9" }],
    });

    const project = await transformers[0]?.({
      pages: [
        {
          title: "Current",
          route: "/docs/configuration",
          docsRoute: "/configuration",
          sourcePath: "/repo/docs/configuration.md",
          frontmatter: {},
          content: "# Current",
        },
        {
          title: "Legacy",
          route: "/docs/versions/0.9/configuration",
          docsRoute: "/versions/0.9/configuration",
          sourcePath: "/repo/docs/versions/0.9/configuration.md",
          frontmatter: {},
          content: "# Legacy",
        },
      ],
      nav: [{ title: "Configuration", path: "/configuration" }],
    });

    expect(project?.pages.map((page) => page.route)).toEqual([
      "/docs/configuration",
      "/docs/versions/0.9/configuration",
    ]);
    expect(project?.pages[1]?.frontmatter).toMatchObject({
      squidocVersion: "0.9",
      squidocVersionLabel: "0.9",
      squidocVersionRoutePrefix: "/docs/versions/0.9",
      squidocVersionCurrent: false,
    });
    expect(project?.nav).toEqual([{ title: "Configuration", path: "/configuration" }]);
    expect(project?.pages[0]?.nav).toEqual([
      { title: "Configuration", path: "/docs/configuration" },
    ]);
    expect(project?.pages[1]?.nav).toEqual([
      { title: "Configuration", path: "/docs/versions/0.9/configuration" },
    ]);
    expect(generatedFiles[0]).toEqual({
      path: "versions.json",
      contents: `${JSON.stringify(
        [
          { name: "1.0", label: "1.0", routePrefix: "/docs", current: true },
          { name: "0.9", label: "0.9", routePrefix: "/docs/versions/0.9", current: false },
        ],
        null,
        2,
      )}\n`,
    });
    expect(slots[0]?.name).toBe("version-selector");
    expect(slots[0]?.html).toContain("data-squidoc-versions");
    expect(slots[0]?.html).toContain('version.routePrefix !== "/"');
  });

  test("supports custom docs and route prefixes", async () => {
    const { transformers } = await setupPlugin({
      current: { name: "next", label: "Next" },
      versions: [{ name: "1.0", docsPrefix: "archive/v1", routePrefix: "/v1" }],
    });

    const project = await transformers[0]?.({
      pages: [
        {
          title: "Legacy Home",
          route: "/docs/archive/v1",
          docsRoute: "/archive/v1",
          sourcePath: "/repo/docs/archive/v1/index.md",
          frontmatter: {},
          content: "# Legacy",
        },
        {
          title: "Legacy API",
          route: "/docs/archive/v1/api",
          docsRoute: "/archive/v1/api",
          sourcePath: "/repo/docs/archive/v1/api.md",
          frontmatter: {},
          content: "# API",
        },
      ],
      nav: [],
    });

    expect(project?.pages.map((page) => page.route)).toEqual(["/docs/v1", "/docs/v1/api"]);
  });
});

async function setupPlugin(options: Record<string, unknown>) {
  const transformers: ProjectTransformer[] = [];
  const generatedFiles: GeneratedFile[] = [];
  const slots: ThemeSlot[] = [];
  const api: PluginApi = {
    addDocExtension() {},
    addGeneratedFile(file) {
      generatedFiles.push(file);
    },
    addHeadTags() {},
    addHtmlTransformer() {},
    addPageHeadTags() {},
    addProjectTransformer(transformer) {
      transformers.push(transformer);
    },
    addSitePage() {},
    addThemeSlot(slot) {
      slots.push(slot);
    },
    config: {
      site: { name: "Test Docs" },
      docs: { basePath: "/docs" },
      docsDir: "docs",
      theme: "@squidoc/theme-basic",
      plugins: [{ name: "@squidoc/plugin-versions", options }],
      nav: [],
    } satisfies ResolvedSquidocConfig,
    cwd: "/repo",
    pages: [],
    pluginOptions: options,
  };

  await plugin.setup?.(api);

  return { transformers, generatedFiles, slots };
}
