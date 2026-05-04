---
title: "Seiten"
description: "Squidoc-Dokumentation zu Seiten."
---

# Seiten

Diese Seite konzentriert sich auf freie Astro-Seiten und erklärt, wie dieser Teil in einem Squidoc-Projekt funktioniert.

## Was du einstellst

Hier lernst du, wie du Homepages, Changelogs oder Produktseiten außerhalb des Docs-Baums bauen kannst.

## Vor dem Veröffentlichen prüfen

Nutze nur die unterstützten Layouts `page` und `docs`; dynamische Routen sind noch nicht vorgesehen.

## Weitere Themen

[Konfiguration](/configuration) · [Plugins](/plugins) · [Deployment](/deployment)

## Beispiele

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
