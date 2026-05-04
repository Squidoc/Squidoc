---
title: "Plugins erstellen"
description: "Dokumentation fuer Squidoc auf Deutsch."
---

# Plugins erstellen

Squidoc ist eine statische Dokumentationsplattform mit Plugins, Themes und SEO-freundlichen Voreinstellungen. Schreibe Markdown, konfiguriere dein Projekt in docs.config.ts und veroeffentliche ein schnelles statisches Docs-Site.

## Projektstruktur

Dokumente liegen in docs/, optionale Astro-Seiten in pages/, und docs.config.ts verbindet Website-Metadaten, Navigation, Plugins und Theme.

## Erweitern

Plugins fuegen Verhalten wie Suche, SEO, Codebloecke, Versionierung, Internationalisierung und generierte Dateien hinzu. Themes steuern Layout, Navigation und Slots.

## Verifizieren

Nutze npm run check, npm run build und npm run preview, bevor du deployest.

## Plugins erstellen

Diese Seite folgt der englischen Dokumentation, damit alle unterstuetzten Sprachen dieselbe Abdeckung fuer die aktuelle Version haben.

[Erste Schritte](/getting-started) · [Konfiguration](/configuration) · [Plugins](/plugins) · [Themes](/themes) · [Deployment](/deployment)

## Referenzbeispiele

```ts
import { definePlugin } from "@squidoc/core";

export default definePlugin({
  name: "@acme/squidoc-plugin-example",
  setup(api) {
    const message =
      typeof api.pluginOptions.message === "string"
        ? api.pluginOptions.message
        : "Generated during squidoc build.";

    api.addGeneratedFile({
      path: "example.txt",
      contents: `${message}\n`,
    });
  },
});
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

```ts
api.addThemeSlot({
  name: "search",
  component: "@squidoc/plugin-search/Search.astro",
  html: "<div data-squidoc-search>...</div>",
});
```
