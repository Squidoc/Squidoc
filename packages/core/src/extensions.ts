import { join } from "node:path";
import { createJiti } from "jiti";
import type { DocPage } from "./docs.js";
import type { NavItem, ResolvedSquidocConfig } from "./schema.js";

export type PluginApi = {
  addDocExtension: (extension: string) => void;
  addGeneratedFile: (file: GeneratedFile) => void;
  addHeadTags: (tags: HeadTag[]) => void;
  addHtmlTransformer: (transformer: HtmlTransformer) => void;
  addPageHeadTags: (factory: PageHeadTagFactory) => void;
  addProjectTransformer: (transformer: ProjectTransformer) => void;
  addSitePage: (page: SitePage) => void;
  addThemeSlot: (slot: ThemeSlot) => void;
  config: ResolvedSquidocConfig;
  cwd: string;
  pages: DocPage[];
  pluginOptions: Record<string, unknown>;
};

export type GeneratedFile = {
  path: string;
  contents: string;
};

export type SitePageLayout = "docs" | "page";

export type SitePage = {
  sourcePath: string;
  sourceRoot: string;
  route: string;
  layout: SitePageLayout;
  title?: string;
  description?: string;
};

export type HeadTag = {
  tag: "meta" | "link" | "script";
  attrs: Record<string, string>;
  content?: string;
};

export type PageHeadTagFactory = (page: DocPage) => HeadTag[];

export type HtmlTransformer = (html: string, page: DocPage) => string | Promise<string>;

export type Project = {
  pages: DocPage[];
  nav: NavItem[];
};

export type ProjectTransformer = (project: Project) => Project | Promise<Project>;

export type ThemeSlot = {
  name: string;
  component: string;
  html?: string;
};

export type SquidocPlugin = {
  name: string;
  setup?: (api: PluginApi) => void | Promise<void>;
};

export function definePlugin(plugin: SquidocPlugin): SquidocPlugin {
  return plugin;
}

export type PluginContext = {
  docExtensions: string[];
  generatedFiles: GeneratedFile[];
  headTags: HeadTag[];
  htmlTransformers: HtmlTransformer[];
  pageHeadTagFactories: PageHeadTagFactory[];
  projectTransformers: ProjectTransformer[];
  sitePages: SitePage[];
  themeSlots: ThemeSlot[];
};

export async function runPlugins(
  config: ResolvedSquidocConfig,
  pages: DocPage[] = [],
  cwd = process.cwd(),
): Promise<PluginContext> {
  const context: PluginContext = {
    docExtensions: [],
    generatedFiles: [],
    headTags: [],
    htmlTransformers: [],
    pageHeadTagFactories: [],
    projectTransformers: [],
    sitePages: [],
    themeSlots: [],
  };
  const api: PluginApi = {
    addDocExtension(extension) {
      if (!context.docExtensions.includes(extension)) {
        context.docExtensions.push(extension);
      }
    },
    addGeneratedFile(file) {
      context.generatedFiles.push(file);
    },
    addHeadTags(tags) {
      context.headTags.push(...tags);
    },
    addHtmlTransformer(transformer) {
      context.htmlTransformers.push(transformer);
    },
    addPageHeadTags(factory) {
      context.pageHeadTagFactories.push(factory);
    },
    addProjectTransformer(transformer) {
      context.projectTransformers.push(transformer);
    },
    addSitePage(page) {
      context.sitePages.push(page);
    },
    addThemeSlot(slot) {
      context.themeSlots.push(slot);
    },
    config,
    cwd,
    pages,
    pluginOptions: {},
  };
  const jiti = createJiti(join(cwd, "docs.config.ts"), { moduleCache: false });

  for (const pluginConfig of config.plugins) {
    const pluginName = typeof pluginConfig === "string" ? pluginConfig : pluginConfig.name;
    const pluginOptions = typeof pluginConfig === "string" ? {} : pluginConfig.options;
    const plugin = await jiti.import<SquidocPlugin>(pluginName, { default: true });

    await plugin.setup?.({ ...api, pluginOptions });
  }

  return context;
}

export async function applyProjectTransforms(
  project: Project,
  transformers: ProjectTransformer[],
): Promise<Project> {
  let transformed = project;

  for (const transformer of transformers) {
    transformed = await transformer(transformed);
  }

  return transformed;
}

export type SquidocTheme = {
  name: string;
  layouts: {
    root?: string;
    docs: string;
    page: string;
  };
  renderer?: {
    globalCss?: string;
    classes?: {
      shell?: string;
      sidebar?: string;
      brand?: string;
      nav?: string;
      content?: string;
    };
  };
  styles?: string[];
  slots?: Record<string, string>;
};

export function defineTheme(theme: SquidocTheme): SquidocTheme {
  return theme;
}

export async function loadTheme(
  config: ResolvedSquidocConfig,
  cwd = process.cwd(),
): Promise<SquidocTheme> {
  const themeName = typeof config.theme === "string" ? config.theme : config.theme.name;
  const jiti = createJiti(join(cwd, "docs.config.ts"), { moduleCache: false });

  return jiti.import<SquidocTheme>(themeName, { default: true });
}
