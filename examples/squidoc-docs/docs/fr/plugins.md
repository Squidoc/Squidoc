---
title: "Plugins"
description: "Documentation Squidoc en français."
---

# Plugins

Squidoc est une plateforme de documentation statique avec plugins, thèmes et réglages SEO par défaut. Écrivez du Markdown, configurez docs.config.ts, puis publiez un site rapide et statique.

## Structure du projet

Les articles vivent dans docs/, les pages Astro facultatives dans pages/, et docs.config.ts relie les métadonnées, la navigation, les plugins et le thème.

## Extension

Les plugins ajoutent recherche, SEO, blocs de code, versionnement, internationalisation et fichiers générés. Les thèmes contrôlent les layouts, la navigation et les slots.

## Vérification

Exécutez npm run check, npm run build et npm run preview avant le déploiement.

## Plugins

Cette page suit la documentation anglaise afin que chaque langue prise en charge garde la même couverture pour la version actuelle.

[Bien démarrer](/getting-started) · [Configuration](/configuration) · [Thèmes](/themes) · [Déploiement](/deployment)

## Exemples de référence

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
