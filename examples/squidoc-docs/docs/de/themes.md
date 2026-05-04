---
title: "Themes"
description: "Squidoc-Dokumentation zu Themes."
---

# Themes

Diese Seite konzentriert sich auf Themes und erklärt, wie dieser Teil in einem Squidoc-Projekt funktioniert.

## Was du einstellst

Hier lernst du, wie du Layout, Navigation, Footer, Slots und visuelle Optionen austauschen kannst.

## Vor dem Veröffentlichen prüfen

Ein Theme sollte die stabilen Layouts `docs` und `page` unterstützen.

## Weitere Themen

[Konfiguration](/configuration) · [Plugins](/plugins) · [Deployment](/deployment)

## Beispiele

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
