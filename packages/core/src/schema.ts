import { z } from "zod";

export const siteConfigSchema = z.object({
  name: z.string().min(1),
  url: z.string().url().optional(),
  description: z.string().optional(),
});

export const docsConfigSchema = z.object({
  basePath: z.string().min(1).default("/docs").transform(normalizeRoutePath),
});

export type NavItemInput = {
  title: string;
  path?: string;
  autogenerate?: NavAutogenerateInput;
  items?: NavItemInput[];
};

export type NavItem = {
  title: string;
  path?: string;
  items?: NavItem[];
};

export type NavAutogenerateInput = {
  from?: string;
  exclude?: string[];
};

export type NavAutogenerate = {
  from: string;
  exclude: string[];
};

export type NavConfigItem = {
  title: string;
  path?: string;
  autogenerate?: NavAutogenerate;
  items?: NavConfigItem[];
};

export type NavConfig = NavConfigItem[] | "auto" | { autogenerate: NavAutogenerate };

export const navAutogenerateSchema = z
  .object({
    from: z.string().min(1).default("/"),
    exclude: z.array(z.string().min(1)).default([]),
  })
  .transform((value) => ({
    from: normalizeRoutePath(value.from),
    exclude: value.exclude,
  }));

export const navItemSchema: z.ZodType<NavConfigItem, z.ZodTypeDef, NavItemInput> = z.lazy(() =>
  z
    .object({
      title: z.string().min(1),
      path: z.string().min(1).optional(),
      autogenerate: navAutogenerateSchema.optional(),
      items: z.array(navItemSchema).optional(),
    })
    .refine((item) => item.path || item.autogenerate || (item.items && item.items.length > 0), {
      message: "Navigation items must define a path, generated section, or child items.",
    }),
);

export const navConfigSchema = z.union([
  z.literal("auto"),
  z.object({ autogenerate: navAutogenerateSchema }),
  z.array(navItemSchema),
]);

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
  docs: docsConfigSchema.default({ basePath: "/docs" }),
  docsDir: z.string().default("docs"),
  theme: themeConfigSchema.default("@squidoc/theme-basic"),
  plugins: z
    .array(pluginConfigSchema)
    .default(["@squidoc/plugin-seo", "@squidoc/plugin-codeblocks", "@squidoc/plugin-article-tree"]),
  nav: navConfigSchema.default([]),
});

export type SquidocConfig = z.input<typeof squidocConfigSchema>;
export type ResolvedSquidocConfig = z.output<typeof squidocConfigSchema>;

export function defineConfig(config: SquidocConfig): SquidocConfig {
  return config;
}

export function resolveConfig(config: unknown): ResolvedSquidocConfig {
  return squidocConfigSchema.parse(config);
}

function normalizeRoutePath(value: string): string {
  const prefixed = value.startsWith("/") ? value : `/${value}`;
  const withoutTrailingSlash = prefixed.replace(/\/+$/, "");

  return withoutTrailingSlash === "" ? "/" : withoutTrailingSlash;
}
