---
title: Crear plugins
description: Extiende Squidoc con archivos generados, metadatos, extensiones de docs y slots de tema.
---

# Crear plugins

Los plugins son paquetes pequeños que exportan una definición Squidoc.

```ts
import { definePlugin } from "@squidoc/core";

export default definePlugin({
  name: "@acme/squidoc-plugin-example",
  setup(api) {
    api.addGeneratedFile({
      path: "example.txt",
      contents: "Generado durante squidoc build.\n",
    });
  },
});
```

Los usuarios pueden configurarlos con forma de objeto:

```ts
plugins: [
  {
    name: "@acme/squidoc-plugin-example",
    options: {
      message: "Hola desde opciones.",
    },
  },
];
```

## API de setup

La API soporta:

- `addGeneratedFile` para assets como `robots.txt`, `sitemap.xml`, `search-index.json` y `llms.txt`.
- `addHeadTags` para metadatos globales.
- `addPageHeadTags` para metadatos por página.
- `addDocExtension` para formatos como `.mdx`.
- `addThemeSlot` para UI que un tema puede renderizar.
- `pluginOptions` para leer las opciones del plugin actual.

El plugin de búsqueda combina archivos generados con un slot: escribe `search-index.json` y registra un slot `search` que el tema básico renderiza.

El plugin de árbol del artículo usa el mismo patrón con el slot `article-tree`.
