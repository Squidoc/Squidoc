import { defineConfig } from "squidoc";

export default defineConfig({
  site: {
    name: "My Docs",
    description: "Documentation powered by Squidoc",
  },
  theme: {
    name: "@squidoc/theme-basic",
    options: {
      primaryColor: "#2563eb",
      headerLinks: [{ title: "GitHub", href: "https://github.com/Squidoc/Squidoc" }],
      footer: {
        text: "Built with Squidoc.",
        links: [{ title: "GitHub", href: "https://github.com/Squidoc/Squidoc" }],
      },
    },
  },
  plugins: ["@squidoc/plugin-seo", "@squidoc/plugin-codeblocks", "@squidoc/plugin-article-tree"],
  nav: [{ title: "Getting Started", path: "/getting-started" }],
});
