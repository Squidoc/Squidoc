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
