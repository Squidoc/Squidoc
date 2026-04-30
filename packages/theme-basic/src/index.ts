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
  height: 100vh;
  min-height: 100vh;
  margin: 0;
  color: var(--squidoc-text);
  background: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

a {
  color: var(--squidoc-accent);
}

.sq-shell {
  flex: 1 1 auto;
  display: grid;
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr) minmax(180px, 240px);
  height: calc(100vh - 60px);
  min-height: 0;
  overflow: hidden;
}

.sq-topbar {
  position: sticky;
  z-index: 10;
  top: 0;
  display: flex;
  align-items: center;
  gap: 20px;
  min-height: 60px;
  border-bottom: 1px solid var(--squidoc-border);
  padding: 0 24px;
  background: rgb(255 255 255 / 94%);
  backdrop-filter: blur(12px);
}

.sq-topbar__brand {
  flex: 0 0 auto;
  color: var(--squidoc-text);
  font-weight: 800;
  text-decoration: none;
}

.sq-topbar__nav {
  display: flex;
  flex: 0 0 auto;
  justify-content: flex-end;
  gap: 16px;
}

.sq-topbar__link {
  color: var(--squidoc-muted);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.sq-topbar__link:hover {
  color: var(--squidoc-text);
}

.sq-sidebar-control {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  opacity: 0;
  pointer-events: none;
}

.sq-sidebar-toggle {
  display: none;
  border: 1px solid var(--squidoc-border);
  border-radius: 8px;
  padding: 7px 10px;
  color: var(--squidoc-text);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.sq-sidebar {
  min-height: 0;
  overflow: auto;
  border-right: 1px solid var(--squidoc-border);
  padding: 24px;
}

.sq-brand {
  margin: 0 0 24px;
  font-size: 18px;
}

.sq-nav {
  font-size: 14px;
}

.sq-nav__list {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sq-nav__list .sq-nav__list {
  margin: 8px 0 2px 14px;
  padding-left: 12px;
  border-left: 1px solid var(--squidoc-border);
}

.sq-nav__item {
  min-width: 0;
}

.sq-nav a,
.sq-nav span {
  display: inline-flex;
  min-width: 0;
  color: var(--squidoc-muted);
  line-height: 1.45;
  overflow-wrap: anywhere;
}

.sq-nav a {
  color: var(--squidoc-muted);
  text-decoration: none;
}

.sq-nav a[aria-current="page"] {
  color: var(--squidoc-text);
  font-weight: 700;
}

.sq-nav details {
  display: grid;
}

.sq-nav summary {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--squidoc-muted);
  cursor: pointer;
  list-style-position: outside;
}

.sq-nav summary::marker {
  color: var(--squidoc-muted);
  font-size: 11px;
}

.sq-nav summary a {
  color: inherit;
}

.sq-search {
  position: relative;
  flex: 1 1 320px;
  max-width: 440px;
  margin: 0 auto;
}

.sq-search__label {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
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
  box-sizing: border-box;
  flex: 1 0 auto;
  width: 100%;
  max-width: 820px;
  padding: 48px;
}

.sq-page {
  display: flex;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  flex-direction: column;
}

.sq-article-tree {
  min-height: 0;
  overflow: auto;
  padding: 48px 24px 24px 0;
}

.sq-article-tree__title {
  margin: 0 0 12px;
  color: var(--squidoc-muted);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

.sq-article-tree__list {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 13px;
}

.sq-article-tree__link {
  color: var(--squidoc-muted);
  line-height: 1.45;
  text-decoration: none;
}

.sq-article-tree__link:hover,
.sq-article-tree__link[data-active] {
  color: var(--squidoc-text);
}

.sq-article-tree__link[data-depth="3"] {
  padding-left: 12px;
}

.sq-content h1 {
  font-size: 42px;
  line-height: 1.1;
}

.sq-content p,
.sq-content li {
  line-height: 1.7;
}

.sq-footer {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  border-top: 1px solid var(--squidoc-border);
  padding: 24px 32px;
  color: var(--squidoc-muted);
  font-size: 14px;
}

.sq-footer__text {
  margin: 0;
}

.sq-footer__nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 14px;
}

.sq-footer__link {
  color: var(--squidoc-muted);
  font-weight: 600;
  text-decoration: none;
}

.sq-footer__link:hover {
  color: var(--squidoc-text);
}

@media (max-width: 760px) {
  body {
    height: auto;
    overflow: auto;
  }

  .sq-topbar {
    flex-wrap: wrap;
    min-height: 56px;
    gap: 10px;
    padding: 10px 16px;
  }

  .sq-topbar__nav {
    display: none;
  }

  .sq-search {
    display: none;
    order: 3;
    flex-basis: 100%;
    max-width: none;
  }

  .sq-sidebar-control:checked + .sq-topbar .sq-search {
    display: block;
  }

  .sq-sidebar-toggle {
    display: inline-flex;
    margin-left: auto;
  }

  .sq-shell {
    display: block;
    height: auto;
    overflow: visible;
  }

  .sq-sidebar {
    display: none;
    position: static;
    height: auto;
    max-height: calc(100vh - 120px);
    border-right: 0;
    border-bottom: 1px solid var(--squidoc-border);
    padding: 18px;
    background: #ffffff;
  }

  .sq-sidebar-control:checked ~ .sq-shell .sq-sidebar {
    display: block;
  }

  .sq-content {
    padding: 28px;
  }

  .sq-page {
    display: block;
    overflow: visible;
  }

  .sq-article-tree {
    display: none;
  }

  .sq-footer {
    display: grid;
    justify-items: start;
    padding: 22px 28px;
  }

  .sq-footer__nav {
    justify-content: flex-start;
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
