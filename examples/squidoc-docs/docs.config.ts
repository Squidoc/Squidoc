import { defineConfig } from "squidoc";

export default defineConfig({
  site: {
    name: "Squidoc",
    url: "https://squidoc.dev",
    description: "Documentation for the Squidoc static docs platform.",
  },
  plugins: ["@squidoc/plugin-seo", "@squidoc/plugin-llms"],
  nav: [
    { title: "Introduction", path: "/" },
    { title: "Architecture", path: "/architecture" },
  ],
});
