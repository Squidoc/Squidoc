import type { DocPage, NavItem, PluginApi, Project } from "@squidoc/core";
import { describe, expect, test } from "vitest";
import plugin from "./index.js";

describe("@squidoc/plugin-i18n", () => {
  test("routes localized docs under the locale prefix", async () => {
    const { pages, slots, files } = await runI18n([
      createPage("/configuration"),
      createPage("/es/configuration"),
    ]);

    expect(pages.map((page) => page.route)).toEqual([
      "/docs/configuration",
      "/es/docs/configuration",
    ]);
    expect(pages[1]?.frontmatter).toMatchObject({
      squidocLocale: "es",
      squidocLocaleLabel: "Español",
      squidocLocaleRoutePrefix: "/es",
      squidocI18nBaseRoute: "/configuration",
    });
    expect(pages[1]?.nav).toEqual([{ title: "Configuration", path: "/es/docs/configuration" }]);
    expect(files[0]?.path).toBe("locales.json");
    expect(slots[0]?.name).toBe("locale-selector");
    expect(slots[0]?.html).toContain("data-squidoc-locales");
  });

  test("composes locale and version routes", async () => {
    const { pages } = await runI18n([
      createPage("/versions/0.1/configuration"),
      createPage("/es/versions/0.1/configuration"),
    ]);

    expect(pages.map((page) => page.route)).toEqual([
      "/docs/versions/0.1/configuration",
      "/es/docs/versions/0.1/configuration",
    ]);
    expect(pages[1]?.frontmatter).toMatchObject({
      squidocLocale: "es",
      squidocVersion: "0.1",
      squidocVersionLabel: "0.1",
      squidocVersionRoutePrefix: "/es/docs/versions/0.1",
      squidocVersionCurrent: false,
    });
  });
});

async function runI18n(inputPages: DocPage[]) {
  const projectTransformers: PluginApi["addProjectTransformer"][] = [];
  const files: Parameters<PluginApi["addGeneratedFile"]>[0][] = [];
  const slots: Parameters<PluginApi["addThemeSlot"]>[0][] = [];
  const nav: NavItem[] = [{ title: "Configuration", path: "/configuration" }];
  const api: PluginApi = {
    addDocExtension() {},
    addGeneratedFile(file) {
      files.push(file);
    },
    addHeadTags() {},
    addHtmlTransformer() {},
    addPageHeadTags() {},
    addProjectTransformer(transformer) {
      projectTransformers.push(transformer);
    },
    addSitePage() {},
    addThemeSlot(slot) {
      slots.push(slot);
    },
    config: {
      site: { name: "Docs" },
      docs: { basePath: "/docs" },
      docsDir: "docs",
      theme: "@squidoc/theme-basic",
      plugins: [
        {
          name: "@squidoc/plugin-versions",
          options: {
            current: { name: "next", label: "Next" },
            versions: [{ name: "0.1", label: "0.1" }],
          },
        },
        {
          name: "@squidoc/plugin-i18n",
          options: {
            defaultLocale: "en",
            locales: [
              { code: "en", label: "English" },
              { code: "es", label: "Español" },
            ],
          },
        },
      ],
      nav,
    },
    cwd: "/repo",
    pages: inputPages,
    pluginOptions: {
      defaultLocale: "en",
      locales: [
        { code: "en", label: "English" },
        { code: "es", label: "Español" },
      ],
    },
  };

  await plugin.setup?.(api);

  let project: Project = { pages: inputPages, nav };
  for (const transformer of projectTransformers) {
    project = await transformer(project);
  }

  return { pages: project.pages, files, slots };
}

function createPage(docsRoute: string): DocPage {
  return {
    sourcePath: `/repo/docs${docsRoute}.md`,
    route: `/docs${docsRoute === "/" ? "" : docsRoute}`,
    docsRoute,
    title: "Configuration",
    description: "Configure Squidoc.",
    frontmatter: {},
    content: "# Configuration",
  };
}
