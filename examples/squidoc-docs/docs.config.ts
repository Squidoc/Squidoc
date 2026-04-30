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
    "@squidoc/plugin-search",
    "@squidoc/plugin-mdx",
  ],
  nav: [
    { title: "Introduction", path: "/" },
    { title: "Getting Started", path: "/getting-started" },
    { title: "Configuration", path: "/configuration" },
    { title: "Architecture", path: "/architecture" },
    { title: "MDX", path: "/mdx" },
    { title: "Testing", path: "/testing" },
  ],
});
