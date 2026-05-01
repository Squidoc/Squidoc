import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { applyProjectTransforms, runPlugins } from "./extensions.js";
import { resolveConfig } from "./schema.js";

describe("runPlugins", () => {
  test("loads object-form plugins and passes plugin options", async () => {
    const cwd = join(process.cwd(), ".tmp", `plugins-${Date.now()}`);
    const pluginPath = join(cwd, "test-plugin.mjs");

    await mkdir(cwd, { recursive: true });
    await writeFile(join(cwd, "docs.config.ts"), "export default {};");
    await writeFile(
      pluginPath,
      `
        export default {
          name: "test-plugin",
          setup(api) {
            api.addGeneratedFile({
              path: "plugin-options.json",
              contents: JSON.stringify(api.pluginOptions)
            });
          }
        };
      `,
    );

    const config = resolveConfig({
      site: { name: "Test Docs" },
      plugins: [{ name: pluginPath, options: { enabled: true, label: "Search" } }],
    });

    const context = await runPlugins(config, [], cwd);

    expect(context.generatedFiles).toEqual([
      {
        path: "plugin-options.json",
        contents: JSON.stringify({ enabled: true, label: "Search" }),
      },
    ]);
  });

  test("applies project transformers in registration order", async () => {
    const project = await applyProjectTransforms(
      {
        pages: [
          {
            sourcePath: "/tmp/docs/index.md",
            route: "/",
            title: "Home",
            frontmatter: {},
            content: "# Home",
          },
        ],
        nav: [{ title: "Home", path: "/" }],
      },
      [
        (input) => ({
          ...input,
          pages: input.pages.map((page) => ({ ...page, route: `/v1${page.route}` })),
        }),
        (input) => ({
          ...input,
          nav: [{ title: "Versions", items: input.nav }],
        }),
      ],
    );

    expect(project.pages[0]?.route).toBe("/v1/");
    expect(project.nav).toEqual([
      {
        title: "Versions",
        items: [{ title: "Home", path: "/" }],
      },
    ]);
  });
});
