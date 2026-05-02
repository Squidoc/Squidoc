import { access } from "node:fs/promises";
import { dirname, join } from "node:path";
import {
  applyProjectTransforms,
  discoverDocs,
  loadConfig,
  resolveNavConfig,
  runPlugins,
} from "@squidoc/core";
import { validateProject } from "./check.js";

export type DoctorReport = {
  configPath: string;
  docsDir: string;
  pageCount: number;
  packageManager: "pnpm" | "yarn" | "npm";
  plugins: string[];
  theme: string;
  issues: string[];
};

export async function inspectProject(cwd = process.cwd()): Promise<DoctorReport> {
  const loaded = await loadConfig({ cwd });
  const capabilities = await runPlugins(loaded.config, [], cwd);
  const pages = await discoverDocs(loaded.config, cwd, {
    extensions: capabilities.docExtensions,
  });
  const nav = resolveNavConfig(loaded.config.nav, pages);
  const project = await applyProjectTransforms({ pages, nav }, capabilities.projectTransformers);
  const config = { ...loaded.config, nav: project.nav };
  const issues = validateProject(config, project.pages).map((issue) => issue.message);

  return {
    configPath: loaded.path,
    docsDir: loaded.config.docsDir,
    pageCount: project.pages.length,
    packageManager: await detectPackageManager(cwd),
    plugins: loaded.config.plugins.map(getPluginDisplayName),
    theme: typeof loaded.config.theme === "string" ? loaded.config.theme : loaded.config.theme.name,
    issues,
  };
}

export function formatDoctorReport(report: DoctorReport): string {
  return [
    "Squidoc doctor",
    "",
    `Config: ${report.configPath}`,
    `Docs directory: ${report.docsDir}`,
    `Pages: ${report.pageCount}`,
    `Package manager: ${report.packageManager}`,
    `Theme: ${report.theme}`,
    `Plugins: ${report.plugins.length > 0 ? report.plugins.join(", ") : "none"}`,
    "",
    report.issues.length > 0
      ? `Issues:\n${report.issues.map((issue) => `- ${issue}`).join("\n")}`
      : "No issues found.",
  ].join("\n");
}

async function detectPackageManager(cwd: string): Promise<DoctorReport["packageManager"]> {
  if (await findUp(cwd, "pnpm-lock.yaml")) {
    return "pnpm";
  }

  if (await findUp(cwd, "yarn.lock")) {
    return "yarn";
  }

  return "npm";
}

function getPluginDisplayName(plugin: string | Record<string, unknown>): string {
  if (typeof plugin === "string") {
    return plugin;
  }

  return typeof plugin.name === "string" ? plugin.name : "unknown plugin";
}

async function findUp(cwd: string, filename: string): Promise<string | undefined> {
  let current = cwd;

  while (true) {
    const candidate = join(current, filename);

    if (await exists(candidate)) {
      return candidate;
    }

    const parent = dirname(current);

    if (parent === current) {
      return undefined;
    }

    current = parent;
  }
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}
