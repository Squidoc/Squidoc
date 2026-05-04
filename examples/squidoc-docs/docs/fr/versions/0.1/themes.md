---
title: "Thèmes"
description: "Guide Squidoc pour Thèmes."
---

# Thèmes

Cette page se concentre sur les thèmes et explique comment cette partie fonctionne dans un projet Squidoc.

## Ce que vous allez configurer

Vous allez apprendre à remplacer layout, navigation, footer, slots et options visuelles.

## À vérifier avant publication

Un thème doit prendre en charge les layouts stables `docs` et `page`.

## À lire aussi

[Configuration](/configuration) · [Plugins](/plugins) · [Déploiement](/deployment)

## Exemples

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
