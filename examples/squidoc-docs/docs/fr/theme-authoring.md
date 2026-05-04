---
title: "Créer des thèmes"
description: "Guide Squidoc pour Créer des thèmes."
---

# Créer des thèmes

Cette page se concentre sur vos propres thèmes et explique comment cette partie fonctionne dans un projet Squidoc.

## Ce que vous allez configurer

Vous allez apprendre à rendre les layouts `docs` et `page`, navigation, footer et slots de plugins.

## À vérifier avant publication

Testez mobile et desktop, car les thèmes respectent les contrats de layout.

## À lire aussi

[Configuration](/configuration) · [Plugins](/plugins) · [Déploiement](/deployment)

## Exemples

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
