import { defineTheme } from "@squidoc/core";

export const globalCss = `:root {
  color-scheme: light;
  --squidoc-accent: #2563eb;
  --squidoc-border: #d8dee8;
  --squidoc-text: #172033;
  --squidoc-muted: #5f6f89;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

body {
  margin: 0;
  color: var(--squidoc-text);
  background: #ffffff;
}

a {
  color: var(--squidoc-accent);
}

.sq-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
}

.sq-sidebar {
  border-right: 1px solid var(--squidoc-border);
  padding: 24px;
}

.sq-brand {
  margin: 0 0 24px;
  font-size: 18px;
}

.sq-nav {
  display: grid;
  gap: 10px;
}

.sq-nav a {
  color: var(--squidoc-muted);
  text-decoration: none;
}

.sq-nav a[aria-current="page"] {
  color: var(--squidoc-text);
  font-weight: 700;
}

.sq-search {
  position: relative;
  margin: 0 0 22px;
}

.sq-search__label {
  display: block;
  margin: 0 0 8px;
  color: var(--squidoc-muted);
  font-size: 13px;
  font-weight: 700;
}

.sq-search__input {
  box-sizing: border-box;
  width: 100%;
  min-height: 38px;
  border: 1px solid var(--squidoc-border);
  border-radius: 8px;
  padding: 8px 10px;
  color: var(--squidoc-text);
  background: #ffffff;
  font: inherit;
}

.sq-search__input:focus {
  border-color: var(--squidoc-accent);
  outline: 2px solid color-mix(in srgb, var(--squidoc-accent), transparent 78%);
  outline-offset: 1px;
}

.sq-search__results {
  display: none;
  position: absolute;
  z-index: 5;
  top: calc(100% + 8px);
  right: 0;
  left: 0;
  max-height: min(420px, 70vh);
  overflow: auto;
  border: 1px solid var(--squidoc-border);
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 16px 36px rgb(23 32 51 / 12%);
}

.sq-search[data-has-query] .sq-search__results {
  display: grid;
}

.sq-search__result {
  display: grid;
  gap: 3px;
  padding: 10px;
  color: var(--squidoc-text);
  text-decoration: none;
}

.sq-search__result + .sq-search__result {
  border-top: 1px solid var(--squidoc-border);
}

.sq-search__result:hover,
.sq-search__result:focus {
  background: #f6f8fb;
  outline: none;
}

.sq-search__result-title {
  font-size: 14px;
  font-weight: 700;
}

.sq-search__result-description {
  color: var(--squidoc-muted);
  font-size: 12px;
  line-height: 1.45;
}

.sq-search__empty {
  margin: 0;
  padding: 10px;
  color: var(--squidoc-muted);
  font-size: 13px;
}

.sq-content {
  max-width: 820px;
  padding: 48px;
}

.sq-content h1 {
  font-size: 42px;
  line-height: 1.1;
}

.sq-content p,
.sq-content li {
  line-height: 1.7;
}

@media (max-width: 760px) {
  .sq-shell {
    display: block;
  }

  .sq-sidebar {
    border-right: 0;
    border-bottom: 1px solid var(--squidoc-border);
  }

  .sq-content {
    padding: 28px;
  }
}
`;

export default defineTheme({
  name: "@squidoc/theme-basic",
  layouts: {
    doc: "./layouts/DocPage.astro",
    home: "./layouts/HomePage.astro",
    root: "./layouts/Root.astro",
  },
  renderer: {
    globalCss,
    classes: {
      brand: "sq-brand",
      content: "sq-content",
      nav: "sq-nav",
      shell: "sq-shell",
      sidebar: "sq-sidebar",
    },
  },
  styles: ["./styles/theme.css"],
  slots: {
    footer: "./components/Footer.astro",
    header: "./components/Header.astro",
    sidebar: "./components/Sidebar.astro",
  },
});
