---
title: "Plugins"
description: "Guía de Squidoc sobre Plugins."
---

# Plugins

Los plugins agregan comportamiento sin obligarte a cambiar cómo escribes tus documentos.

## Qué vas a configurar

Puedes instalar búsqueda, SEO, bloques de código, árbol de artículo, páginas Astro, versionado, i18n, MDX y archivos para LLMs.

## Qué revisar antes de publicar

Lee las opciones de cada plugin y cuida el orden cuando dos plugins componen rutas, idiomas o versiones.

## También puedes leer

[Configuración](/configuration) · [Plugins](/plugins) · [Deployment](/deployment)

## Ejemplos

```bash
npx squidoc add plugin @squidoc/plugin-search
```

```bash
npm install @squidoc/plugin-search
```

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
