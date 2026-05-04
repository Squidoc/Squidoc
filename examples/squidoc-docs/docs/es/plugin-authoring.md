---
title: "Creación de plugins"
description: "Guía de Squidoc sobre Creación de plugins."
---

# Creación de plugins

La creación de plugins te permite engancharte al ciclo de Squidoc para añadir archivos, metadata, extensiones de documentos o slots de tema.

## Qué vas a configurar

Define un paquete, exporta el objeto de plugin y usa opciones explícitas cuando tu plugin necesite configuración del usuario.

## Qué revisar antes de publicar

Prueba el plugin en el sitio dogfood y documenta las opciones para que el orden y los efectos sean claros.

## También puedes leer

[Configuración](/configuration) · [Plugins](/plugins) · [Deployment](/deployment)

## Ejemplos

```ts
import { definePlugin } from "@squidoc/core";

export default definePlugin({
  name: "@acme/squidoc-plugin-example",
  setup(api) {
    const message =
      typeof api.pluginOptions.message === "string"
        ? api.pluginOptions.message
        : "Generated during squidoc build.";

    api.addGeneratedFile({
      path: "example.txt",
      contents: `${message}\n`,
    });
  },
});
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

```ts
api.addThemeSlot({
  name: "search",
  component: "@squidoc/plugin-search/Search.astro",
  html: "<div data-squidoc-search>...</div>",
});
```
