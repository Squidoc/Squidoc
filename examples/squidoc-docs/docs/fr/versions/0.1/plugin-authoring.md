---
title: "Créer des plugins"
description: "Guide Squidoc pour Créer des plugins."
---

# Créer des plugins

Cette page se concentre sur vos propres plugins et explique comment cette partie fonctionne dans un projet Squidoc.

## Ce que vous allez configurer

Vous allez apprendre à ajouter hooks de build, fichiers générés, métadonnées, extensions et slots.

## À vérifier avant publication

Les options doivent être validées explicitement et documentées.

## À lire aussi

[Configuration](/configuration) · [Plugins](/plugins) · [Déploiement](/deployment)

## Exemples

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
