import { defineTheme } from "@squidoc/core";

export default defineTheme({
  name: "@squidoc/theme-basic",
  layouts: {
    doc: "./layouts/DocPage.astro",
    home: "./layouts/HomePage.astro",
    root: "./layouts/Root.astro",
  },
  styles: ["./styles/theme.css"],
  slots: {
    footer: "./components/Footer.astro",
    header: "./components/Header.astro",
    sidebar: "./components/Sidebar.astro",
  },
});
