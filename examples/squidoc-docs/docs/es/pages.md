---
title: Páginas
description: Crea páginas Astro personalizadas para rutas que no son documentación.
---

# Páginas

`@squidoc/plugin-pages` permite publicar páginas Astro que no son artículos Markdown: homepages, changelogs, páginas de producto, páginas legales o cualquier ruta estática personalizada.

El starter incluye el plugin. Si lo agregas manualmente:

```bash
npx squidoc add plugin @squidoc/plugin-pages
```

## Crear una página

Crea un archivo en `pages/`:

```astro
---
export const squidoc = {
  title: "Changelog",
  description: "Actualizaciones del producto.",
  layout: "page",
};
---

<h1>Changelog</h1>
```

`pages/index.astro` se publica como `/`. `pages/changelog.astro` se publica como `/changelog`.

## Directorio personalizado

Puedes cambiar el directorio:

```ts
plugins: [
  {
    name: "@squidoc/plugin-pages",
    options: {
      pagesDir: "custom-pages",
    },
  },
];
```

`squidoc dev` observa el directorio configurado, así que cambios en `custom-pages/` regeneran el proyecto interno.

## Layouts

Squidoc soporta exactamente dos layouts:

- `page`: layout predeterminado para páginas personalizadas. Incluye navbar y footer, pero no sidebar ni árbol del artículo.
- `docs`: layout de documentación. Incluye sidebar, selector de versión, árbol del artículo y estilos de contenido.

Si omites `layout`, Squidoc usa `page`.

## Límites

Las páginas son Astro estáticas. No son API routes, endpoints SSR ni páginas server-only.

No se permiten conflictos de ruta. Por ejemplo, `pages/docs.astro` entra en conflicto con el índice de docs en `/docs`.

Rutas reservadas como `404.astro` y `500.astro` no están soportadas. Rutas dinámicas como `[slug].astro` tampoco están soportadas todavía.

La metadata debe usar `export const squidoc = { ... }` con valores string para `title`, `description` y `layout`.

## Ejemplos de referencia

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
