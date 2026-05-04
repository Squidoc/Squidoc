---
title: "CLI-Referenz"
description: "Squidoc-Dokumentation zu CLI-Referenz."
---

# CLI-Referenz

Diese Seite konzentriert sich auf die Squidoc CLI und erklärt, wie dieser Teil in einem Squidoc-Projekt funktioniert.

## Was du einstellst

Hier lernst du, wie du dev, build, preview, check, doctor und add im Alltag nutzen kannst.

## Vor dem Veröffentlichen prüfen

`doctor` prüft die Umgebung; `check` prüft Projekt- und Routingfehler.

## Weitere Themen

[Konfiguration](/configuration) · [Plugins](/plugins) · [Deployment](/deployment)

## Beispiele

```json
{
  "scripts": {
    "dev": "squidoc dev",
    "build": "squidoc build",
    "preview": "squidoc preview",
    "check": "squidoc check",
    "doctor": "squidoc doctor"
  }
}
```

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run preview
```

```bash
npm run check
```

```bash
npm run doctor
```

```bash
npx squidoc add plugin @squidoc/plugin-search
npx squidoc add theme @squidoc/theme-basic
```
