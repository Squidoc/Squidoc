---
title: "Frontmatter"
description: "Guide Squidoc pour Frontmatter."
---

# Frontmatter

Cette page se concentre sur les métadonnées de document et explique comment cette partie fonctionne dans un projet Squidoc.

## Ce que vous allez configurer

Vous allez apprendre à piloter titre, description et navigation depuis Markdown.

## À vérifier avant publication

Ces champs alimentent navigation, recherche et SEO; gardez-les courts et clairs.

## À lire aussi

[Configuration](/configuration) · [Plugins](/plugins) · [Déploiement](/deployment)

## Exemples

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
