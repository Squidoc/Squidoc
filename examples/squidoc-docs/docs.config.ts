import { defineConfig } from "squidoc";

export default defineConfig({
  site: {
    name: "Squidoc",
    url: "https://squidoc.dev",
    description: "Documentation for the Squidoc static docs platform.",
  },
  plugins: [
    "@squidoc/plugin-seo",
    "@squidoc/plugin-llms",
    "@squidoc/plugin-codeblocks",
    "@squidoc/plugin-article-tree",
    "@squidoc/plugin-search",
    "@squidoc/plugin-mdx",
  ],
  theme: {
    name: "@squidoc/theme-basic",
    options: {
      headerLinks: [{ title: "GitHub", href: "https://github.com/Squidoc/Squidoc" }],
      footer: {
        text: "Built with Squidoc.",
        links: [
          { title: "GitHub", href: "https://github.com/Squidoc/Squidoc" },
          { title: "Configuration", path: "/configuration" },
        ],
      },
    },
  },
  nav: [
    { title: "Introduction", path: "/" },
    { title: "Getting Started", path: "/getting-started" },
    { title: "Configuration", path: "/configuration" },
    { title: "Frontmatter", path: "/frontmatter" },
    { title: "CLI Reference", path: "/cli" },
    { title: "Deployment", path: "/deployment" },
    {
      title: "Customization",
      items: [
        { title: "Plugins", path: "/plugins" },
        { title: "Themes", path: "/themes" },
        { title: "Versioning", path: "/versioning" },
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
