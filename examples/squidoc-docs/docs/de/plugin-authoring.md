---
title: "Plugins erstellen"
description: "Squidoc-Dokumentation zu Plugins erstellen."
---

# Plugins erstellen

Diese Seite konzentriert sich auf eigene Plugins und erklärt, wie dieser Teil in einem Squidoc-Projekt funktioniert.

## Was du einstellst

Hier lernst du, wie du Build-Hooks, generierte Dateien, Metadaten, Dokument-Erweiterungen und Slots hinzufügen kannst.

## Vor dem Veröffentlichen prüfen

Optionen sollten explizit validiert und in den Nutzerdocs erklärt werden.

## Weitere Themen

[Konfiguration](/configuration) · [Plugins](/plugins) · [Deployment](/deployment)

## Beispiele

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
