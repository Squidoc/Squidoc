---
title: "Frontmatter"
description: "Dokumentation fuer Squidoc auf Deutsch."
---

# Frontmatter

Squidoc ist eine statische Dokumentationsplattform mit Plugins, Themes und SEO-freundlichen Voreinstellungen. Schreibe Markdown, konfiguriere dein Projekt in docs.config.ts und veroeffentliche ein schnelles statisches Docs-Site.

## Projektstruktur

Dokumente liegen in docs/, optionale Astro-Seiten in pages/, und docs.config.ts verbindet Website-Metadaten, Navigation, Plugins und Theme.

## Erweitern

Plugins fuegen Verhalten wie Suche, SEO, Codebloecke, Versionierung, Internationalisierung und generierte Dateien hinzu. Themes steuern Layout, Navigation und Slots.

## Verifizieren

Nutze npm run check, npm run build und npm run preview, bevor du deployest.

## Frontmatter

Diese Seite folgt der englischen Dokumentation, damit alle unterstuetzten Sprachen dieselbe Abdeckung fuer die aktuelle Version haben.

[Erste Schritte](/getting-started) · [Konfiguration](/configuration) · [Plugins](/plugins) · [Themes](/themes) · [Deployment](/deployment)

## Referenzbeispiele

```md
---
title: API Guide
description: Learn how to use the API.
---

# API Guide
```

```md
---
title: Plugin Authoring
description: Build Squidoc plugins.
nav:
  title: Plugins
  order: 20
  hidden: false
  hideChildren: false
---
```

```md
---
title: Release Notes
description: Product release notes.
owner: Docs Team
---
```
