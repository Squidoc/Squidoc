---
title: "Frontmatter"
description: "Squidoc-Dokumentation zu Frontmatter."
---

# Frontmatter

Diese Seite konzentriert sich auf Dokument-Metadaten und erklärt, wie dieser Teil in einem Squidoc-Projekt funktioniert.

## Was du einstellst

Hier lernst du, wie du Titel, Beschreibung und Navigationsverhalten direkt in Markdown steuern kannst.

## Vor dem Veröffentlichen prüfen

Diese Felder beeinflussen Navigation, Suche und SEO, also halte sie kurz und eindeutig.

## Weitere Themen

[Konfiguration](/configuration) · [Plugins](/plugins) · [Deployment](/deployment)

## Beispiele

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
