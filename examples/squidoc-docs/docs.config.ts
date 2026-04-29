import { defineConfig } from "squidoc";

export default defineConfig({
  site: {
    name: "Squidoc",
    description: "Documentation for the Squidoc static docs platform.",
  },
  plugins: ["@squidoc/plugin-seo"],
  nav: [
    { title: "Introduction", path: "/" },
    { title: "Architecture", path: "/architecture" },
  ],
});
