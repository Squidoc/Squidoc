---
title: "Temas"
description: "Guía de Squidoc sobre Temas."
---

# Temas

Los temas deciden la estructura visual del sitio: layout, navegación, slots, estilos y controles globales.

## Qué vas a configurar

Configura `theme.name` y `theme.options` para cambiar el paquete de tema y pasar links, footer, colores o metadata visual.

## Qué revisar antes de publicar

Asegúrate de que el tema soporte los layouts `docs` y `page`, porque los plugins pueden renderizar ambos tipos de contenido.

## También puedes leer

[Configuración](/configuration) · [Plugins](/plugins) · [Deployment](/deployment)

## Ejemplos

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
