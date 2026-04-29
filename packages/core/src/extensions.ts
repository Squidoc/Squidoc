import { join } from "node:path";
import { createJiti } from "jiti";
import type { ResolvedSquidocConfig } from "./schema.js";

export type PluginApi = {
  addGeneratedFile: (file: GeneratedFile) => void;
  addHeadTags: (tags: HeadTag[]) => void;
  addThemeSlot: (slot: ThemeSlot) => void;
};

export type GeneratedFile = {
  path: string;
  contents: string;
};

export type HeadTag = {
  tag: "meta" | "link" | "script";
  attrs: Record<string, string>;
  content?: string;
};

export type ThemeSlot = {
  name: string;
  component: string;
};

export type SquidocPlugin = {
  name: string;
  setup?: (api: PluginApi) => void | Promise<void>;
};

export function definePlugin(plugin: SquidocPlugin): SquidocPlugin {
  return plugin;
}

export type PluginContext = {
  generatedFiles: GeneratedFile[];
  headTags: HeadTag[];
  themeSlots: ThemeSlot[];
};

export async function runPlugins(
  config: ResolvedSquidocConfig,
  cwd = process.cwd(),
): Promise<PluginContext> {
  const context: PluginContext = {
    generatedFiles: [],
    headTags: [],
    themeSlots: [],
  };
  const api: PluginApi = {
    addGeneratedFile(file) {
      context.generatedFiles.push(file);
    },
    addHeadTags(tags) {
      context.headTags.push(...tags);
    },
    addThemeSlot(slot) {
      context.themeSlots.push(slot);
    },
  };
  const jiti = createJiti(join(cwd, "docs.config.ts"), { moduleCache: false });

  for (const pluginConfig of config.plugins) {
    if (typeof pluginConfig !== "string") {
      continue;
    }

    const plugin = await jiti.import<SquidocPlugin>(pluginConfig, { default: true });
    await plugin.setup?.(api);
  }

  return context;
}

export type SquidocTheme = {
  name: string;
  layouts: {
    root?: string;
    doc: string;
    home?: string;
  };
  styles?: string[];
  slots?: Record<string, string>;
};

export function defineTheme(theme: SquidocTheme): SquidocTheme {
  return theme;
}
