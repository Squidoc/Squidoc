import { describe, expect, test } from "vitest";
import { getProjectPackageName } from "./project-name.js";

describe("getProjectPackageName", () => {
  test.each([
    ["docs", "docs"],
    ["My Docs", "my-docs"],
    ["../Acme Docs!", "acme-docs"],
    ["@internal/docs", "docs"],
    ["---", "squidoc-docs"],
  ])("converts %s to %s", (targetDir, expected) => {
    expect(getProjectPackageName(targetDir)).toBe(expected);
  });
});
