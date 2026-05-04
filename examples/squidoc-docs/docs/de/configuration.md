---
title: "Konfiguration"
description: "Dokumentation fuer Squidoc auf Deutsch."
---

# Konfiguration

Squidoc ist eine statische Dokumentationsplattform mit Plugins, Themes und SEO-freundlichen Voreinstellungen. Schreibe Markdown, konfiguriere dein Projekt in docs.config.ts und veroeffentliche ein schnelles statisches Docs-Site.

## Projektstruktur

Dokumente liegen in docs/, optionale Astro-Seiten in pages/, und docs.config.ts verbindet Website-Metadaten, Navigation, Plugins und Theme.

## Erweitern

Plugins fuegen Verhalten wie Suche, SEO, Codebloecke, Versionierung, Internationalisierung und generierte Dateien hinzu. Themes steuern Layout, Navigation und Slots.

## Verifizieren

Nutze npm run check, npm run build und npm run preview, bevor du deployest.

## Konfiguration

Diese Seite folgt der englischen Dokumentation, damit alle unterstuetzten Sprachen dieselbe Abdeckung fuer die aktuelle Version haben.

[Erste Schritte](/getting-started) · [Plugins](/plugins) · [Themes](/themes) · [Deployment](/deployment)

## Referenzbeispiele

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
