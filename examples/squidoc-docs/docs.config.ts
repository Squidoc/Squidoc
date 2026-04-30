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
    "@squidoc/plugin-syntax-highlight",
    "@squidoc/plugin-search",
    "@squidoc/plugin-mdx",
  ],
  nav: [
    { title: "Introduction", path: "/" },
    { title: "Getting Started", path: "/getting-started" },
    { title: "Configuration", path: "/configuration" },
    {
      title: "Developers",
      path: "/developers",
      items: [
        { title: "Plugin Authoring", path: "/plugin-authoring" },
        { title: "Theme Authoring", path: "/theme-authoring" },
      ],
    },
    { title: "Architecture", path: "/architecture" },
    { title: "MDX", path: "/mdx" },
    { title: "Testing", path: "/testing" },
  ],
});
