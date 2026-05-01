import { describe, expect, test } from "vitest";
import { detectPackageManager, getNextStepCommands } from "./package-manager.js";

describe("package manager next steps", () => {
  test.each([
    ["pnpm/10.30.2 npm/? node/v22.17.1 darwin arm64", "pnpm"],
    ["npm/10.9.2 node/v22.17.1 darwin arm64 workspaces/false", "npm"],
    ["yarn/1.22.22 npm/? node/v22.17.1 darwin arm64", "yarn"],
    ["bun/1.2.0 npm/? node/v22.17.1 darwin arm64", "bun"],
  ] as const)("detects %s", (userAgent, expected) => {
    expect(detectPackageManager(userAgent)).toBe(expected);
  });

  test("defaults to pnpm when the launcher is unknown", () => {
    expect(detectPackageManager(undefined)).toBe("pnpm");
    expect(detectPackageManager("node/v22.17.1")).toBe("pnpm");
  });

  test.each([
    ["pnpm", { install: "pnpm install", dev: "pnpm dev" }],
    ["npm", { install: "npm install", dev: "npm run dev" }],
    ["yarn", { install: "yarn install", dev: "yarn dev" }],
    ["bun", { install: "bun install", dev: "bun dev" }],
  ] as const)("prints %s commands", (packageManager, commands) => {
    expect(getNextStepCommands(packageManager)).toEqual(commands);
  });
});
