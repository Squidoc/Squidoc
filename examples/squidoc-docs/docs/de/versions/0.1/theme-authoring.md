---
title: "Themes erstellen"
description: "Squidoc-Dokumentation zu Themes erstellen."
---

# Themes erstellen

Diese Seite konzentriert sich auf eigene Themes und erklärt, wie dieser Teil in einem Squidoc-Projekt funktioniert.

## Was du einstellst

Hier lernst du, wie du die Layouts `docs` und `page`, Navigation, Footer und Plugin-Slots rendern kannst.

## Vor dem Veröffentlichen prüfen

Teste Themes auf Mobilgeräten und Desktop, weil sie die stabilen Layout-Verträge erfüllen müssen.

## Weitere Themen

[Konfiguration](/configuration) · [Plugins](/plugins) · [Deployment](/deployment)

## Beispiele

```ts
import { defineTheme } from "@squidoc/core";

export default defineTheme({
  name: "@acme/squidoc-theme",
  layouts: {
    docs: "./layouts/Docs.astro",
    page: "./layouts/Page.astro",
  },
  renderer: {
    globalCss: "...",
    classes: {
      shell: "docs-shell",
      sidebar: "docs-sidebar",
      content: "docs-content",
    },
  },
});
```

```astro
---
export const squidoc = {
  title: "Changelog",
  layout: "docs",
};
---
```
