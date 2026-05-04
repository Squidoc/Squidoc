import { defineConfig } from "squidoc";

export default defineConfig({
  site: {
    name: "Squidoc",
    url: "https://squidoc.com",
    description: "Documentation for the Squidoc static docs platform.",
  },
  plugins: [
    "@squidoc/plugin-seo",
    "@squidoc/plugin-llms",
    "@squidoc/plugin-codeblocks",
    "@squidoc/plugin-article-tree",
    "@squidoc/plugin-search",
    "@squidoc/plugin-pages",
    "@squidoc/plugin-mdx",
    {
      name: "@squidoc/plugin-versions",
      options: {
        current: {
          name: "next",
          label: "Next",
          routePrefix: "/next",
          hidden: true,
        },
        versions: [
          {
            name: "0.1",
            label: "0.1",
            routePrefix: "/",
            current: true,
          },
        ],
      },
    },
    {
      name: "@squidoc/plugin-i18n",
      options: {
        defaultLocale: "en",
        locales: [
          { code: "en", label: "English" },
          {
            code: "es",
            label: "Español",
            navLabels: {
              Customization: "Personalización",
              "Authoring Extensions": "Crear extensiones",
            },
          },
          {
            code: "de",
            label: "Deutsch",
            navLabels: {
              Customization: "Anpassung",
              "Authoring Extensions": "Erweiterungen erstellen",
            },
          },
          {
            code: "fr",
            label: "Français",
            navLabels: {
              Customization: "Personnalisation",
              "Authoring Extensions": "Créer des extensions",
            },
          },
          {
            code: "ja",
            label: "日本語",
            navLabels: {
              Customization: "カスタマイズ",
              "Authoring Extensions": "拡張機能の作成",
            },
          },
          {
            code: "zh-CN",
            label: "简体中文",
            navLabels: {
              Customization: "自定义",
              "Authoring Extensions": "编写扩展",
            },
          },
          {
            code: "pt-BR",
            label: "Português do Brasil",
            navLabels: {
              Customization: "Personalização",
              "Authoring Extensions": "Criar extensões",
            },
          },
        ],
      },
    },
  ],
  theme: {
    name: "@squidoc/theme-basic",
    options: {
      headerLinks: [
        { title: "Docs", path: "/docs" },
        { title: "GitHub", href: "https://github.com/Squidoc/Squidoc" },
      ],
      footer: {
        text: "Built with Squidoc.",
        links: [
          { title: "GitHub", href: "https://github.com/Squidoc/Squidoc" },
          { title: "Configuration", path: "/docs/configuration" },
        ],
      },
    },
  },
  nav: [
    { title: "Introduction", path: "/" },
    { title: "Getting Started", path: "/getting-started" },
    { title: "Configuration", path: "/configuration" },
    { title: "Frontmatter", path: "/frontmatter" },
    { title: "Sidebar Navigation", path: "/navigation" },
    { title: "CLI Reference", path: "/cli" },
    { title: "Deployment", path: "/deployment" },
    {
      title: "Customization",
      items: [
        { title: "Plugins", path: "/plugins" },
        { title: "Pages", path: "/pages" },
        { title: "Themes", path: "/themes" },
        { title: "Versioning", path: "/versioning" },
        { title: "Internationalization", path: "/i18n" },
        { title: "MDX", path: "/mdx" },
      ],
    },
    {
      title: "Authoring Extensions",
      path: "/developers",
      items: [
        { title: "Plugin Authoring", path: "/plugin-authoring" },
        { title: "Theme Authoring", path: "/theme-authoring" },
      ],
    },
  ],
});
