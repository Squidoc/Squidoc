import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { formatDoctorReport, inspectProject } from "./doctor.js";

describe("inspectProject", () => {
  test("reports project health", async () => {
    const cwd = join(process.cwd(), ".tmp", `doctor-${Date.now()}`);
    await mkdir(join(cwd, "docs"), { recursive: true });
    await writeFile(join(cwd, "pnpm-lock.yaml"), "");
    await writeFile(
      join(cwd, "docs.config.ts"),
      `
        import { defineConfig } from "${resolve(process.cwd(), "../core/src/index.ts")}";

        export default defineConfig({
          site: {
            name: "Test Docs"
          },
          plugins: []
        });
      `,
    );
    await writeFile(join(cwd, "docs", "index.md"), "# Home\n");

    const report = await inspectProject(cwd);

    expect(report).toMatchObject({
      docsDir: "docs",
      pageCount: 1,
      packageManager: "pnpm",
      plugins: [],
      theme: "@squidoc/theme-basic",
      issues: [],
    });
  });
});

describe("formatDoctorReport", () => {
  test("formats issues", () => {
    const output = formatDoctorReport({
      configPath: "/repo/docs.config.ts",
      docsDir: "docs",
      pageCount: 0,
      packageManager: "npm",
      plugins: [],
      theme: "@squidoc/theme-basic",
      issues: ["No documentation pages found in docs."],
    });

    expect(output).toContain("Squidoc doctor");
    expect(output).toContain("Issues:\n- No documentation pages found in docs.");
  });
});
