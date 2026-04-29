import { spawn } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { type ResolvedSquidocConfig, findConfigFile, loadConfig } from "@squidoc/core";

export type AddKind = "plugin" | "theme";

export type AddOptions = {
  cwd?: string;
  install?: boolean;
};

export async function addExtension(
  kind: AddKind,
  name: string,
  options: AddOptions = {},
): Promise<void> {
  const cwd = options.cwd ?? process.cwd();
  const install = options.install ?? true;
  const configPath = await findConfigFile(cwd);
  const loaded = await loadConfig({ cwd, configFile: configPath });
  const nextConfig = applyExtension(loaded.config, kind, name);

  if (install) {
    await installPackage(cwd, name);
  }

  await writeFile(configPath, renderConfig(nextConfig));
}

export function applyExtension(
  config: ResolvedSquidocConfig,
  kind: AddKind,
  name: string,
): ResolvedSquidocConfig {
  if (kind === "plugin") {
    const plugins = config.plugins.some((plugin) => getPluginName(plugin) === name)
      ? config.plugins
      : [...config.plugins, name];

    return { ...config, plugins };
  }

  const theme =
    typeof config.theme === "string"
      ? name
      : { ...config.theme, name, options: config.theme.options ?? {} };

  return { ...config, theme };
}

export function renderConfig(config: ResolvedSquidocConfig): string {
  return `import { defineConfig } from "squidoc";

export default defineConfig(${formatValue(config)});
`;
}

async function installPackage(cwd: string, name: string): Promise<void> {
  const command = await getInstallCommand(cwd, name);

  await new Promise<void>((resolve, reject) => {
    const child = spawn(command.bin, command.args, {
      cwd,
      stdio: "inherit",
      shell: process.platform === "win32",
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          `${command.bin} ${command.args.join(" ")} exited with code ${code ?? "unknown"}.`,
        ),
      );
    });
  });
}

async function getInstallCommand(
  cwd: string,
  name: string,
): Promise<{ bin: string; args: string[] }> {
  if (await exists(join(cwd, "pnpm-lock.yaml"))) {
    return { bin: "pnpm", args: ["add", name] };
  }

  if (await exists(join(cwd, "yarn.lock"))) {
    return { bin: "yarn", args: ["add", name] };
  }

  return { bin: "npm", args: ["install", name] };
}

async function exists(path: string): Promise<boolean> {
  try {
    await readFile(path);
    return true;
  } catch {
    return false;
  }
}

function getPluginName(plugin: ResolvedSquidocConfig["plugins"][number]): string | undefined {
  if (typeof plugin === "string") {
    return plugin;
  }

  const maybeName = plugin.name;
  return typeof maybeName === "string" ? maybeName : undefined;
}

function formatValue(value: unknown, level = 0): string {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[]";
    }

    const nextLevel = level + 1;
    const items = value.map((item) => `${indent(nextLevel)}${formatValue(item, nextLevel)}`);
    return `[\n${items.join(",\n")}\n${indent(level)}]`;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value);

    if (entries.length === 0) {
      return "{}";
    }

    const nextLevel = level + 1;
    const properties = entries.map(
      ([key, item]) => `${indent(nextLevel)}${formatKey(key)}: ${formatValue(item, nextLevel)}`,
    );
    return `{\n${properties.join(",\n")}\n${indent(level)}}`;
  }

  return JSON.stringify(value);
}

function formatKey(key: string): string {
  return /^[A-Za-z_$][\w$]*$/.test(key) ? key : JSON.stringify(key);
}

function indent(level: number): string {
  return "  ".repeat(level);
}
