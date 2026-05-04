---
title: "Erste Schritte"
description: "Squidoc-Dokumentation zu Erste Schritte."
---

# Erste Schritte

Diese Seite konzentriert sich auf ein neues Projekt und erklärt, wie dieser Teil in einem Squidoc-Projekt funktioniert.

## Was du einstellst

Hier lernst du, wie du Projekt erzeugen, Abhängigkeiten installieren und den Dev-Server starten kannst.

## Vor dem Veröffentlichen prüfen

`check` und `build` sollten sauber laufen, bevor du die ersten Docs veröffentlichst.

## Weitere Themen

[Konfiguration](/configuration) · [Plugins](/plugins) · [Deployment](/deployment)

## Beispiele

```bash
npm create squidoc@latest my-docs
cd my-docs
npm run dev
```

```md
---
title: API Guide
description: Learn how to use the API.
---

# API Guide

Write your documentation here.
```

```ts
nav: [
  { title: "Getting Started", path: "/getting-started" },
  { title: "API Guide", path: "/api-guide" },
];
```

```bash
npm run check
npm run build
npm run preview
```
