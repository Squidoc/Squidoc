import { describe, expect, test } from "vitest";
import type { DocPage } from "./docs.js";
import { resolveNavConfig } from "./nav.js";

describe("resolveNavConfig", () => {
  test("generates navigation from docs routes", () => {
    const nav = resolveNavConfig("auto", [
      page("/", "Introduction"),
      page("/getting-started", "Getting Started"),
      page("/developers", "Developers"),
      page("/developers/plugin-authoring", "Plugin Authoring"),
      page("/developers/theme-authoring", "Theme Authoring"),
    ]);

    expect(nav).toEqual([
      { title: "Introduction", path: "/" },
      {
        title: "Developers",
        path: "/developers",
        items: [
          { title: "Plugin Authoring", path: "/developers/plugin-authoring" },
          { title: "Theme Authoring", path: "/developers/theme-authoring" },
        ],
      },
      { title: "Getting Started", path: "/getting-started" },
    ]);
  });

  test("mixes manual items with generated sections", () => {
    const nav = resolveNavConfig(
      [
        { title: "Introduction", path: "/" },
        {
          title: "Developers",
          autogenerate: { from: "/developers", exclude: [], generatedPosition: "before" },
          items: [{ title: "Manual Extra", path: "/manual-extra" }],
        },
      ],
      [
        page("/", "Introduction"),
        page("/developers", "Developers"),
        page("/developers/plugin-authoring", "Plugin Authoring"),
        page("/developers/theme-authoring", "Theme Authoring"),
      ],
    );

    expect(nav).toEqual([
      { title: "Introduction", path: "/" },
      {
        title: "Developers",
        path: "/developers",
        items: [
          { title: "Plugin Authoring", path: "/developers/plugin-authoring" },
          { title: "Theme Authoring", path: "/developers/theme-authoring" },
          { title: "Manual Extra", path: "/manual-extra" },
        ],
      },
    ]);
  });

  test("can place manual items before generated children", () => {
    const nav = resolveNavConfig(
      [
        {
          title: "Developers",
          autogenerate: {
            from: "/developers",
            exclude: [],
            generatedPosition: "after",
          },
          items: [{ title: "Overview", path: "/developers/overview" }],
        },
      ],
      [
        page("/developers/plugin-authoring", "Plugin Authoring"),
        page("/developers/theme-authoring", "Theme Authoring"),
      ],
    );

    expect(nav).toEqual([
      {
        title: "Developers",
        items: [
          { title: "Overview", path: "/developers/overview" },
          { title: "Plugin Authoring", path: "/developers/plugin-authoring" },
          { title: "Theme Authoring", path: "/developers/theme-authoring" },
        ],
      },
    ]);
  });

  test("uses frontmatter nav metadata", () => {
    const nav = resolveNavConfig(
      { autogenerate: { from: "/", exclude: ["versions/**"], generatedPosition: "before" } },
      [
        page("/01-intro", "01 Intro", { nav: { title: "Intro", order: 10 } }),
        page("/02-hidden", "Hidden", { nav: { hidden: true } }),
        page("/03-reference", "Reference", { nav: { order: 20 } }),
        page("/versions/0.1/intro", "Old Intro"),
      ],
    );

    expect(nav).toEqual([
      { title: "Intro", path: "/01-intro" },
      { title: "Reference", path: "/03-reference" },
    ]);
  });

  test("keeps hidden folder children grouped unless hideChildren is set", () => {
    const nav = resolveNavConfig("auto", [
      page("/", "Introduction"),
      page("/developers", "Developer Guides", {
        nav: { title: "Developers", hidden: true, order: 10 },
      }),
      page("/developers/plugin-authoring", "Plugin Authoring"),
      page("/developers/theme-authoring", "Theme Authoring"),
      page("/internal", "Internal", { nav: { hidden: true, hideChildren: true } }),
      page("/internal/drafts", "Drafts"),
    ]);

    expect(nav).toEqual([
      { title: "Introduction", path: "/" },
      {
        title: "Developers",
        items: [
          { title: "Plugin Authoring", path: "/developers/plugin-authoring" },
          { title: "Theme Authoring", path: "/developers/theme-authoring" },
        ],
      },
    ]);
  });

  test("returns an empty generated section for folders without pages", () => {
    const nav = resolveNavConfig(
      [
        {
          title: "Empty",
          autogenerate: { from: "/empty", exclude: [], generatedPosition: "before" },
        },
      ],
      [page("/", "Introduction")],
    );

    expect(nav).toEqual([{ title: "Empty" }]);
  });
});

function page(
  docsRoute: string,
  title: string,
  frontmatter: Record<string, unknown> = {},
): DocPage {
  return {
    sourcePath: `/docs${docsRoute === "/" ? "/index" : docsRoute}.md`,
    route: `/docs${docsRoute === "/" ? "" : docsRoute}`,
    docsRoute,
    title,
    frontmatter,
    content: "",
  };
}
