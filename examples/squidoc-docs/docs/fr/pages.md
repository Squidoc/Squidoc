---
title: "Pages"
description: "Guide Squidoc pour Pages."
---

# Pages

Cette page se concentre sur des pages Astro libres et explique comment cette partie fonctionne dans un projet Squidoc.

## Ce que vous allez configurer

Vous allez apprendre à créer homepages, changelogs ou pages produit hors de l’arbre docs.

## À vérifier avant publication

Utilisez seulement `page` et `docs`; les routes dynamiques ne sont pas encore prises en charge.

## À lire aussi

[Configuration](/configuration) · [Plugins](/plugins) · [Déploiement](/deployment)

## Exemples

```txt
docs/
  index.md
  configuration.md
pages/
  index.astro
  changelog.astro
```

```txt
/docs/
/docs/configuration/
/
/changelog/
```

```bash
npm install @squidoc/plugin-pages
```

```ts
import { defineConfig } from "squidoc";

export default defineConfig({
  plugins: [
    "@squidoc/plugin-seo",
    "@squidoc/plugin-pages",
    "@squidoc/plugin-codeblocks",
    "@squidoc/plugin-article-tree",
  ],
});
```

```astro
---
export const squidoc = {
  title: "My Docs",
  description: "A custom homepage for my docs site.",
};
---

<section>
  <h1>My Docs</h1>
  <p>Read the latest documentation.</p>
  <a href="/docs/getting-started">Get started</a>
</section>
```

```ts
export default defineConfig({
  plugins: [
    {
      name: "@squidoc/plugin-pages",
      options: {
        pagesDir: "custom-pages",
      },
    },
  ],
});
```

```astro
---
export const squidoc = {
  title: "Changelog",
  layout: "docs",
};
---

<h1>Changelog</h1>
```
