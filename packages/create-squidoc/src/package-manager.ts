export type PackageManager = "bun" | "npm" | "pnpm" | "yarn";

export type NextStepCommands = {
  install: string;
  dev: string;
};

export function detectPackageManager(
  userAgent = process.env.npm_config_user_agent,
): PackageManager {
  const name = userAgent?.split(" ")[0]?.split("/")[0];

  switch (name) {
    case "bun":
    case "npm":
    case "pnpm":
    case "yarn":
      return name;
    default:
      return "pnpm";
  }
}

export function getNextStepCommands(packageManager: PackageManager): NextStepCommands {
  switch (packageManager) {
    case "bun":
      return {
        install: "bun install",
        dev: "bun dev",
      };
    case "npm":
      return {
        install: "npm install",
        dev: "npm run dev",
      };
    case "yarn":
      return {
        install: "yarn install",
        dev: "yarn dev",
      };
    case "pnpm":
      return {
        install: "pnpm install",
        dev: "pnpm dev",
      };
  }
}
