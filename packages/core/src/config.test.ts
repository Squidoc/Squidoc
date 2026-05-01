import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { loadConfig } from "./config.js";
import { resolveConfig } from "./schema.js";

describe("loadConfig", () => {
  test("loads and resolves docs.config.ts", async () => {
    const cwd = join(process.cwd(), ".tmp", `config-${Date.now()}`);
    await mkdir(cwd, { recursive: true });
    await writeFile(
      join(cwd, "docs.config.ts"),
      `
        import { defineConfig } from "${join(process.cwd(), "src/index.ts")}";

        export default defineConfig({
          site: {
            name: "Test Docs"
          }
        });
      `,
    );

    const loaded = await loadConfig({ cwd });

    expect(loaded.config).toMatchObject({
      site: {
        name: "Test Docs",
      },
      docsDir: "docs",
      theme: "@squidoc/theme-basic",
      plugins: [
        "@squidoc/plugin-seo",
        "@squidoc/plugin-codeblocks",
        "@squidoc/plugin-article-tree",
      ],
      nav: [],
    });
  });

  test("supports nested navigation folders", async () => {
    const cwd = join(process.cwd(), ".tmp", `config-nav-${Date.now()}`);
    await mkdir(cwd, { recursive: true });
    await writeFile(
      join(cwd, "docs.config.ts"),
      `
        import { defineConfig } from "${join(process.cwd(), "src/index.ts")}";

        export default defineConfig({
          site: {
            name: "Test Docs"
          },
          nav: [
            {
              title: "Developers",
              path: "/developers",
              items: [
                { title: "Plugins", path: "/plugins" },
                { title: "Themes", path: "/themes" }
              ]
            },
            {
              title: "Reference",
              items: [
                { title: "Config", path: "/config" }
              ]
            }
          ]
        });
      `,
    );

    const loaded = await loadConfig({ cwd });

    expect(loaded.config.nav).toEqual([
      {
        title: "Developers",
        path: "/developers",
        items: [
          { title: "Plugins", path: "/plugins" },
          { title: "Themes", path: "/themes" },
        ],
      },
      {
        title: "Reference",
        items: [{ title: "Config", path: "/config" }],
      },
    ]);
  });

  test("rejects object-form plugins without a name", () => {
    expect(() =>
      resolveConfig({
        site: { name: "Test Docs" },
        plugins: [{ options: { enabled: true } }],
      }),
    ).toThrow();
  });
});
