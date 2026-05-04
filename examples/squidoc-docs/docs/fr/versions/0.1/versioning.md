---
title: "Versionnement"
description: "Documentation Squidoc en français."
---

# Versionnement

Squidoc est une plateforme de documentation statique avec plugins, thèmes et réglages SEO par défaut. Écrivez du Markdown, configurez docs.config.ts, puis publiez un site rapide et statique.

## Structure du projet

Les articles vivent dans docs/, les pages Astro facultatives dans pages/, et docs.config.ts relie les métadonnées, la navigation, les plugins et le thème.

## Extension

Les plugins ajoutent recherche, SEO, blocs de code, versionnement, internationalisation et fichiers générés. Les thèmes contrôlent les layouts, la navigation et les slots.

## Vérification

Exécutez npm run check, npm run build et npm run preview avant le déploiement.

## Versioning

Cette page suit la documentation anglaise afin que chaque langue prise en charge garde la même couverture pour la version actuelle.

[Bien démarrer](/getting-started) · [Configuration](/configuration) · [Plugins](/plugins) · [Thèmes](/themes) · [Déploiement](/deployment)

## Exemples de référence

```bash
npx squidoc add plugin @squidoc/plugin-versions
```

```ts
export default defineConfig({
  plugins: [
    "@squidoc/plugin-seo",
    "@squidoc/plugin-codeblocks",
    "@squidoc/plugin-article-tree",
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
          },
        ],
      },
    },
  ],
});
```

```txt
docs/
  index.md
  configuration.md
  plugin-authoring.md
```

```txt
docs/
  versions/
    0.9/
      index.md
      configuration.md
      plugin-authoring.md
```

```ts
{
  name: "@squidoc/plugin-versions",
  options: {
    current: { name: "2.0", label: "2.0" },
    versions: [
      {
        name: "1.0",
        label: "1.0",
        docsPrefix: "archive/v1",
        routePrefix: "/v1",
      },
    ],
  },
}
```

```ts
{
  name: "@squidoc/plugin-versions",
  options: {
    current: {
      name: "next",
      label: "Next",
      routePrefix: "/next",
      hidden: true,
    },
    versions: [
      {
        name: "0.1",
        label: "0.1",
        routePrefix: "/",
        current: true,
      },
    ],
  },
}
```

```json
[
  {
    "name": "1.0",
    "label": "1.0",
    "routePrefix": "/docs",
    "current": true,
    "routes": ["/docs", "/docs/configuration"]
  },
  {
    "name": "0.9",
    "label": "0.9",
    "routePrefix": "/docs/versions/0.9",
    "current": false,
    "routes": ["/docs/versions/0.9", "/docs/versions/0.9/configuration"]
  }
]
```

```ts
{
  squidocVersion: "0.9",
  squidocVersionLabel: "0.9",
  squidocVersionRoutePrefix: "/docs/versions/0.9",
  squidocVersionCurrent: false,
}
```
