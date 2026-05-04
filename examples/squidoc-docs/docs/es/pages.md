---
title: "Páginas"
description: "Guía de Squidoc sobre Páginas."
---

# Páginas

El plugin de páginas permite crear rutas no documentales con Astro, como homepages, changelogs o páginas de producto.

## Qué vas a configurar

Pon archivos `.astro` en `pages/`, exporta metadata `squidoc` y elige `layout: "page"` o `layout: "docs"` cuando lo necesites.

## Qué revisar antes de publicar

Evita rutas dinámicas por ahora y recuerda que estas páginas conviven con `docs.basePath`, no lo reemplazan.

## También puedes leer

[Configuración](/configuration) · [Plugins](/plugins) · [Deployment](/deployment)

## Ejemplos

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
