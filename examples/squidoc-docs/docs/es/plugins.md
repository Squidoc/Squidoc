---
title: Plugins
description: Entiende los plugins Squidoc, cómo instalarlos, configurarlos y elegir los plugins integrados.
---

# Plugins

Los plugins agregan comportamiento a un sitio Squidoc sin cambiar cómo los autores escriben documentación. Pueden agregar archivos generados, tags en `<head>`, metadatos por página, extensiones de documentos o slots de UI que renderiza un tema.

Instala un plugin con la CLI:

```bash
npx squidoc add plugin @squidoc/plugin-search
```

También puedes instalar el paquete y editar `docs.config.ts`:

```ts
plugins: [
  "@squidoc/plugin-seo",
  "@squidoc/plugin-pages",
  "@squidoc/plugin-codeblocks",
  "@squidoc/plugin-article-tree",
  "@squidoc/plugin-search",
];
```

## Plugins integrados

### `@squidoc/plugin-seo`

Agrega favicons, Open Graph, Twitter cards, canonical links, alternates `hreflang`, `robots.txt` y `sitemap.xml` cuando `site.url` está configurado. No tiene opciones.

### `@squidoc/plugin-codeblocks`

Agrega resaltado de sintaxis y botones de copiar para bloques de código. Opción principal: `theme`, por defecto `"github-light"`.

### `@squidoc/plugin-pages`

Agrega soporte para páginas Astro fuera de docs. Opción: `pagesDir`, por defecto `"pages"`. Consulta [Páginas](/pages).

### `@squidoc/plugin-article-tree`

Agrega el árbol “En esta página” con tracking activo mientras el lector hace scroll. No tiene opciones.

### `@squidoc/plugin-search`

Genera `search-index.json` y registra el slot `search`. La búsqueda se limita a la versión e idioma activos cuando los plugins de versionado e i18n están habilitados.

### `@squidoc/plugin-mdx`

Permite descubrir archivos `.mdx`. Todavía no compila componentes JSX; consulta [MDX](/mdx).

### `@squidoc/plugin-llms`

Genera `llms.txt` y `llms-full.txt` para documentación legible por herramientas de IA.

### `@squidoc/plugin-versions`

Agrega rutas versionadas, metadata de versión, selector de versión y `versions.json`. Opciones:

| Opción | Tipo | Descripción |
| --- | --- | --- |
| `current` | `VersionConfig` | Configura el árbol principal de docs, por defecto la versión actual. |
| `versions` | `VersionConfig[]` | Versiones archivadas que se publican desde `docs/versions/{name}` por defecto. |

`VersionConfig` soporta `name`, `label`, `routePrefix`, `docsPrefix`, `current` y `hidden`. Usa `current: true` para marcar qué versión es la predeterminada para búsqueda y selector. Usa `hidden: true` para publicar una versión sin mostrarla en el selector.

### `@squidoc/plugin-i18n`

Agrega rutas localizadas, selector de idioma, metadata de locale, búsqueda por idioma y alternates SEO. Opciones: `defaultLocale` y `locales`. Consulta [Internacionalización](/i18n).

## Orden de plugins

El orden importa cuando los plugins se componen. Si usas versionado e i18n juntos, coloca `@squidoc/plugin-versions` antes de `@squidoc/plugin-i18n`.

## Ejemplos de referencia

```ts
export default defineConfig({
  plugins: [
    "@squidoc/plugin-seo",
    "@squidoc/plugin-pages",
    "@squidoc/plugin-codeblocks",
    "@squidoc/plugin-article-tree",
    "@squidoc/plugin-search",
  ],
});
```

```ts
plugins: [
  {
    name: "@acme/squidoc-plugin-example",
    options: {
      message: "Hello from plugin options.",
    },
  },
];
```

```ts
plugins: ["@squidoc/plugin-seo"];
```

```ts
plugins: [
  {
    name: "@squidoc/plugin-codeblocks",
    options: {
      theme: "github-light",
    },
  },
];
```

```ts
plugins: [
  {
    name: "@squidoc/plugin-pages",
    options: {
      pagesDir: "pages",
    },
  },
];
```

```astro
---
export const squidoc = {
  title: "Changelog",
  description: "Product updates and release notes.",
  layout: "page",
};
---
```

```ts
plugins: ["@squidoc/plugin-article-tree"];
```

```ts
plugins: ["@squidoc/plugin-search"];
```

```ts
plugins: ["@squidoc/plugin-mdx"];
```

```ts
plugins: ["@squidoc/plugin-llms"];
```

```ts
plugins: [
  {
    name: "@squidoc/plugin-versions",
    options: {
      current: {
        name: "1.0",
        label: "1.0",
      },
      versions: [
        {
          name: "0.9",
          label: "0.9",
          docsPrefix: "versions/0.9",
          routePrefix: "/versions/0.9",
        },
      ],
    },
  },
];
```

```ts
plugins: [
  {
    name: "@squidoc/plugin-i18n",
    options: {
      defaultLocale: "en",
      locales: [
        { code: "en", label: "English" },
        { code: "es", label: "Español" },
      ],
    },
  },
];
```

```ts
plugins: [
  "@squidoc/plugin-seo",
  "@squidoc/plugin-pages",
  "@squidoc/plugin-codeblocks",
  "@squidoc/plugin-article-tree",
];
```
