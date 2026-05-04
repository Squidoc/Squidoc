---
title: "Creación de temas"
description: "Guía de Squidoc sobre Creación de temas."
---

# Creación de temas

La creación de temas controla cómo se renderizan los layouts `docs` y `page`.

## Qué vas a configurar

Un tema debe leer la configuración, renderizar navegación, footer y slots, y dejar espacio para plugins como búsqueda, árbol de artículo o selectores.

## Qué revisar antes de publicar

Verifica escritorio y móvil, porque los temas son la parte más visible y los plugins dependen de sus slots.

## También puedes leer

[Configuración](/configuration) · [Plugins](/plugins) · [Deployment](/deployment)

## Ejemplos

```ts
import { defineTheme } from "@squidoc/core";

export default defineTheme({
  name: "@acme/squidoc-theme",
  layouts: {
    docs: "./layouts/Docs.astro",
    page: "./layouts/Page.astro",
  },
  renderer: {
    globalCss: "...",
    classes: {
      shell: "docs-shell",
      sidebar: "docs-sidebar",
      content: "docs-content",
    },
  },
});
```

```astro
---
export const squidoc = {
  title: "Changelog",
  layout: "docs",
};
---
```
