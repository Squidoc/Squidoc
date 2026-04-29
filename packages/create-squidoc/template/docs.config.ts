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
      headerLinks: [],
    },
  },
  plugins: ["@squidoc/plugin-seo"],
  nav: [{ title: "Getting Started", path: "/getting-started" }],
});
