import { access } from "node:fs/promises";
import { join } from "node:path";
import { createJiti } from "jiti";
import { type ResolvedSquidocConfig, resolveConfig } from "./schema.js";

export const CONFIG_FILENAMES = ["docs.config.ts", "docs.config.mjs", "docs.config.js"] as const;

export type LoadConfigOptions = {
  cwd?: string;
  configFile?: string;
};

export type LoadedConfig = {
  path: string;
  config: ResolvedSquidocConfig;
};

export async function findConfigFile(cwd = process.cwd()): Promise<string> {
  for (const filename of CONFIG_FILENAMES) {
    const candidate = join(cwd, filename);

    try {
      await access(candidate);
      return candidate;
    } catch {
      // Try the next supported config filename.
    }
  }

  throw new Error(`Could not find a Squidoc config file in ${cwd}. Expected docs.config.ts.`);
}

export async function loadConfig(options: LoadConfigOptions = {}): Promise<LoadedConfig> {
  const cwd = options.cwd ?? process.cwd();
  const configPath = options.configFile ?? (await findConfigFile(cwd));
  const jiti = createJiti(configPath, { moduleCache: false });
  const loaded = await jiti.import(configPath, { default: true });

  return {
    path: configPath,
    config: resolveConfig(loaded),
  };
}
