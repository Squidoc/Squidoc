import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { loadConfig } from "@squidoc/core";
import { describe, expect, test } from "vitest";
import { addExtension, applyExtension, renderConfig } from "./add.js";

describe("applyExtension", () => {
  test("adds a plugin once", () => {
    const config = applyExtension(
      {
        site: { name: "Test Docs" },
        docsDir: "docs",
        theme: "@squidoc/theme-basic",
        plugins: ["@squidoc/plugin-seo"],
        nav: [],
      },
      "plugin",
      "@squidoc/plugin-search",
    );

    expect(config.plugins).toEqual(["@squidoc/plugin-seo", "@squidoc/plugin-search"]);
    expect(applyExtension(config, "plugin", "@squidoc/plugin-search").plugins).toEqual(
      config.plugins,
    );
  });

  test("replaces the theme name", () => {
    const config = applyExtension(
      {
        site: { name: "Test Docs" },
        docsDir: "docs",
        theme: { name: "@squidoc/theme-basic", options: { color: "teal" } },
        plugins: ["@squidoc/plugin-seo"],
        nav: [],
      },
      "theme",
      "@squidoc/theme-docs",
    );

    expect(config.theme).toEqual({
      name: "@squidoc/theme-docs",
      options: { color: "teal" },
    });
  });
});

describe("addExtension", () => {
  test("updates docs.config.ts without installing when requested", async () => {
    const cwd = join(process.cwd(), ".tmp", `add-${Date.now()}`);
    await mkdir(cwd, { recursive: true });
    await writeFile(
      join(cwd, "docs.config.ts"),
      `
        import { defineConfig } from "${resolve(process.cwd(), "../core/src/index.ts")}";

        export default defineConfig({
          site: {
            name: "Test Docs"
          }
        });
      `,
    );

    await addExtension("plugin", "@squidoc/plugin-search", { cwd, install: false });

    const contents = await readFile(join(cwd, "docs.config.ts"), "utf8");
    const loaded = await loadConfig({ cwd });

    expect(contents).toContain('"@squidoc/plugin-search"');
    expect(loaded.config.plugins).toEqual([
      "@squidoc/plugin-seo",
      "@squidoc/plugin-codeblocks",
      "@squidoc/plugin-article-tree",
      "@squidoc/plugin-search",
    ]);
  });
});

describe("renderConfig", () => {
  test("prints readable TypeScript config", () => {
    const contents = renderConfig({
      site: { name: "Test Docs" },
      docsDir: "docs",
      theme: "@squidoc/theme-basic",
      plugins: ["@squidoc/plugin-seo"],
      nav: [],
    });

    expect(contents).toContain("site: {");
    expect(contents).toContain('name: "Test Docs"');
    expect(contents).toContain('plugins: [\n    "@squidoc/plugin-seo"\n  ]');
  });
});
