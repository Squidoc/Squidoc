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
          autogenerate: { from: "/developers", exclude: [] },
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

  test("uses frontmatter nav metadata", () => {
    const nav = resolveNavConfig({ autogenerate: { from: "/", exclude: ["versions/**"] } }, [
      page("/01-intro", "01 Intro", { nav: { title: "Intro", order: 10 } }),
      page("/02-hidden", "Hidden", { nav: { hidden: true } }),
      page("/03-reference", "Reference", { nav: { order: 20 } }),
      page("/versions/0.1/intro", "Old Intro"),
    ]);

    expect(nav).toEqual([
      { title: "Intro", path: "/01-intro" },
      { title: "Reference", path: "/03-reference" },
    ]);
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
