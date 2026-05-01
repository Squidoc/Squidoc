import { z } from "zod";

export const siteConfigSchema = z.object({
  name: z.string().min(1),
  url: z.string().url().optional(),
  description: z.string().optional(),
});

export type NavItemInput = {
  title: string;
  path?: string;
  items?: NavItemInput[];
};

export type NavItem = {
  title: string;
  path?: string;
  items?: NavItem[];
};

export const navItemSchema: z.ZodType<NavItem, z.ZodTypeDef, NavItemInput> = z.lazy(() =>
  z
    .object({
      title: z.string().min(1),
      path: z.string().min(1).optional(),
      items: z.array(navItemSchema).optional(),
    })
    .refine((item) => item.path || (item.items && item.items.length > 0), {
      message: "Navigation items must define a path or child items.",
    }),
);

export const themeConfigSchema = z.union([
  z.string().min(1),
  z.object({
    name: z.string().min(1),
    options: z.record(z.unknown()).default({}),
  }),
]);

export const pluginConfigSchema = z.union([
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
  plugins: z
    .array(pluginConfigSchema)
    .default(["@squidoc/plugin-seo", "@squidoc/plugin-codeblocks", "@squidoc/plugin-article-tree"]),
  nav: z.array(navItemSchema).default([]),
});

export type SquidocConfig = z.input<typeof squidocConfigSchema>;
export type ResolvedSquidocConfig = z.output<typeof squidocConfigSchema>;

export function defineConfig(config: SquidocConfig): SquidocConfig {
  return config;
}

export function resolveConfig(config: unknown): ResolvedSquidocConfig {
  return squidocConfigSchema.parse(config);
}
