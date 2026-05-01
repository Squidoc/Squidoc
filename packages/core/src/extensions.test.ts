import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { runPlugins } from "./extensions.js";
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
});
