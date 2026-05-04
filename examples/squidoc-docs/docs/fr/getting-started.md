---
title: "Bien démarrer"
description: "Guide Squidoc pour Bien démarrer."
---

# Bien démarrer

Cette page se concentre sur un nouveau projet et explique comment cette partie fonctionne dans un projet Squidoc.

## Ce que vous allez configurer

Vous allez apprendre à créer le projet, installer les dépendances et lancer le serveur de dev.

## À vérifier avant publication

`check` et `build` doivent passer avant la première publication.

## À lire aussi

[Configuration](/configuration) · [Plugins](/plugins) · [Déploiement](/deployment)

## Exemples

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
