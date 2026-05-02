import { defineConfig } from "squidoc";

export default defineConfig({
  site: {
    name: "My Docs",
    description: "Documentation powered by Squidoc",
  },
  theme: {
    name: "@squidoc/theme-basic",
    options: {
      primaryColor: "#4a54df",
      headerLinks: [{ title: "GitHub", href: "https://github.com/Squidoc/Squidoc" }],
      footer: {
        text: "Built with Squidoc.",
        links: [{ title: "GitHub", href: "https://github.com/Squidoc/Squidoc" }],
      },
    },
  },
  plugins: [
    "@squidoc/plugin-seo",
    "@squidoc/plugin-pages",
    "@squidoc/plugin-codeblocks",
    "@squidoc/plugin-article-tree",
    {
      name: "@squidoc/plugin-i18n",
      options: {
        defaultLocale: "en",
        locales: [{ code: "en", label: "English" }],
      },
    },
  ],
  nav: [{ title: "Getting Started", path: "/getting-started" }],
});
