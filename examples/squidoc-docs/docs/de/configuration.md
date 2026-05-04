---
title: "Konfiguration"
description: "Squidoc-Dokumentation zu Konfiguration."
---

# Konfiguration

Diese Seite konzentriert sich auf `docs.config.ts` und erklärt, wie dieser Teil in einem Squidoc-Projekt funktioniert.

## Was du einstellst

Hier lernst du, wie du Site-Metadaten, Docs-Basisroute, Theme-Optionen, Plugins und Navigation definieren kannst.

## Vor dem Veröffentlichen prüfen

Ändere Navigation und Plugins bewusst; `squidoc check` findet fehlende Routen früh.

## Weitere Themen

[Konfiguration](/configuration) · [Plugins](/plugins) · [Deployment](/deployment)

## Beispiele

```ts
import { defineConfig } from "squidoc";

export default defineConfig({
  site: {
    name: "My Docs",
    url: "https://docs.example.com",
    description: "Documentation powered by Squidoc",
  },
  docs: {
    basePath: "/docs",
  },
  theme: {
    name: "@squidoc/theme-basic",
    options: {
      headerLinks: [{ title: "GitHub", href: "https://github.com/Squidoc/Squidoc" }],
      footer: {
        text: "Built with Squidoc.",
        links: [
          { title: "GitHub", href: "https://github.com/Squidoc/Squidoc" },
          { title: "Configuration", path: "/docs/configuration" },
        ],
      },
    },
  },
  plugins: [
    "@squidoc/plugin-seo",
    "@squidoc/plugin-pages",
    "@squidoc/plugin-codeblocks",
    "@squidoc/plugin-article-tree",
  ],
  nav: [
    { title: "Introduction", path: "/" },
    { title: "Getting Started", path: "/getting-started" },
    { title: "Configuration", path: "/configuration" },
    { title: "Sidebar Navigation", path: "/navigation" },
    {
      title: "Customization",
      items: [
        { title: "Plugins", path: "/plugins" },
        { title: "Themes", path: "/themes" },
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
```

```bash
npx squidoc add plugin @squidoc/plugin-search
npx squidoc add theme @squidoc/theme-basic
```

```ts
plugins: [
  {
    name: "@acme/squidoc-plugin-example",
    options: {
      message: "Generated from plugin options.",
    },
  },
];
```
