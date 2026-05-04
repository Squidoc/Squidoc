---
title: "Configuration"
description: "Documentation Squidoc en français."
---

# Configuration

Squidoc est une plateforme de documentation statique avec plugins, thèmes et réglages SEO par défaut. Écrivez du Markdown, configurez docs.config.ts, puis publiez un site rapide et statique.

## Structure du projet

Les articles vivent dans docs/, les pages Astro facultatives dans pages/, et docs.config.ts relie les métadonnées, la navigation, les plugins et le thème.

## Extension

Les plugins ajoutent recherche, SEO, blocs de code, versionnement, internationalisation et fichiers générés. Les thèmes contrôlent les layouts, la navigation et les slots.

## Vérification

Exécutez npm run check, npm run build et npm run preview avant le déploiement.

## Configuration

Cette page suit la documentation anglaise afin que chaque langue prise en charge garde la même couverture pour la version actuelle.

[Bien démarrer](/getting-started) · [Plugins](/plugins) · [Thèmes](/themes) · [Déploiement](/deployment)

## Exemples de référence

```ts
import { defineConfig } from "squidoc";

export default defineConfig({
  site: {
    name: "My Docs",
    url: "https://docs.example.com",
    description: "Documentation powered by Squidoc",
  },
  docs: {
    basePath: "/docs",
  },
  theme: {
    name: "@squidoc/theme-basic",
    options: {
      headerLinks: [{ title: "GitHub", href: "https://github.com/Squidoc/Squidoc" }],
      footer: {
        text: "Built with Squidoc.",
        links: [
          { title: "GitHub", href: "https://github.com/Squidoc/Squidoc" },
          { title: "Configuration", path: "/docs/configuration" },
        ],
      },
    },
  },
  plugins: [
    "@squidoc/plugin-seo",
    "@squidoc/plugin-pages",
    "@squidoc/plugin-codeblocks",
    "@squidoc/plugin-article-tree",
  ],
  nav: [
    { title: "Introduction", path: "/" },
    { title: "Getting Started", path: "/getting-started" },
    { title: "Configuration", path: "/configuration" },
    { title: "Sidebar Navigation", path: "/navigation" },
    {
      title: "Customization",
      items: [
        { title: "Plugins", path: "/plugins" },
        { title: "Themes", path: "/themes" },
      ],
    },
    {
      title: "Authoring Extensions",
      path: "/developers",
      items: [
        { title: "Plugin Authoring", path: "/plugin-authoring" },
        { title: "Theme Authoring", path: "/theme-authoring" },
      ],
    },
  ],
});
```

```bash
npx squidoc add plugin @squidoc/plugin-search
npx squidoc add theme @squidoc/theme-basic
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
