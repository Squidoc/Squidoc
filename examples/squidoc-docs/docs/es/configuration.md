---
title: "Configuración"
description: "Guía de Squidoc sobre Configuración."
---

# Configuración

`docs.config.ts` es el centro del proyecto: define metadata del sitio, ruta base de docs, tema, plugins y navegación.

## Qué vas a configurar

Ajusta `site`, `docs.basePath`, `theme.options`, `plugins` y `nav` para que el sitio publicado refleje tu producto y tus rutas reales.

## Qué revisar antes de publicar

Ejecuta `squidoc check` después de cambiar navegación o plugins para detectar rutas faltantes y configuraciones inválidas antes del deploy.

## También puedes leer

[Configuración](/configuration) · [Plugins](/plugins) · [Deployment](/deployment)

## Ejemplos

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
