---
title: "Thèmes"
description: "Documentation Squidoc en français."
---

# Thèmes

Squidoc est une plateforme de documentation statique avec plugins, thèmes et réglages SEO par défaut. Écrivez du Markdown, configurez docs.config.ts, puis publiez un site rapide et statique.

## Structure du projet

Les articles vivent dans docs/, les pages Astro facultatives dans pages/, et docs.config.ts relie les métadonnées, la navigation, les plugins et le thème.

## Extension

Les plugins ajoutent recherche, SEO, blocs de code, versionnement, internationalisation et fichiers générés. Les thèmes contrôlent les layouts, la navigation et les slots.

## Vérification

Exécutez npm run check, npm run build et npm run preview avant le déploiement.

## Thèmes

Cette page suit la documentation anglaise afin que chaque langue prise en charge garde la même couverture pour la version actuelle.

[Bien démarrer](/getting-started) · [Configuration](/configuration) · [Plugins](/plugins) · [Déploiement](/deployment)

## Exemples de référence

```ts
export default defineConfig({
  theme: "@squidoc/theme-basic",
});
```

```ts
export default defineConfig({
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
});
```

```bash
npx squidoc add theme @acme/squidoc-theme
```

```bash
npm install @acme/squidoc-theme
```

```ts
export default defineConfig({
  theme: "@acme/squidoc-theme",
});
```

```ts
primaryColor: "#4a54df";
```

```ts
headerLinks: [
  { title: "GitHub", href: "https://github.com/Squidoc/Squidoc" },
  { title: "Deployment", path: "/docs/deployment" },
];
```

```ts
footer: {
  text: "Built with Squidoc.",
  links: [
    { title: "GitHub", href: "https://github.com/Squidoc/Squidoc" },
    { title: "Plugins", path: "/docs/plugins" },
  ],
};
```
