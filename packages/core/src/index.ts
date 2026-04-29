import { z } from "zod";

export const siteConfigSchema = z.object({
  name: z.string().min(1),
  url: z.string().url().optional(),
  description: z.string().optional(),
});

export const navItemSchema = z.object({
  title: z.string().min(1),
  path: z.string().min(1),
});

export const themeConfigSchema = z.union([
  z.string().min(1),
  z.object({
    name: z.string().min(1),
    options: z.record(z.unknown()).default({}),
  }),
]);

export const squidocConfigSchema = z.object({
  site: siteConfigSchema,
  docsDir: z.string().default("docs"),
  theme: themeConfigSchema.default("@squidoc/theme-basic"),
  plugins: z.array(z.union([z.string(), z.record(z.unknown())])).default(["@squidoc/plugin-seo"]),
  nav: z.array(navItemSchema).default([]),
});

export type SquidocConfig = z.input<typeof squidocConfigSchema>;
export type ResolvedSquidocConfig = z.output<typeof squidocConfigSchema>;

export function defineConfig(config: SquidocConfig): SquidocConfig {
  return config;
}

export function resolveConfig(config: SquidocConfig): ResolvedSquidocConfig {
  return squidocConfigSchema.parse(config);
}

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
