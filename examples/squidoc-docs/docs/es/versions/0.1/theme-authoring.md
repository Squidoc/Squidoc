---
title: Crear temas
description: Da forma a páginas Squidoc con clases, CSS, layouts y slots.
---

# Crear temas

Los temas controlan la estructura y presentación de un sitio Squidoc.

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
  },
});
```

El renderer actual usa `renderer` para CSS global y clases. Esto mantiene el sitio estático y rápido mientras permite cambiar estructura y apariencia.

## Contrato de layouts

Por ahora Squidoc soporta exactamente dos layouts:

- `docs`: páginas de documentación con sidebar, selector de idioma, selector de versión, árbol del artículo y estilos de contenido.
- `page`: páginas personalizadas de `@squidoc/plugin-pages`, como homepages, changelogs o páginas de producto.

Si una página omite `layout`, Squidoc usa `page`.

## Slots de plugins

El tema básico renderiza:

- `search` en la navbar.
- `locale-selector` en la navbar.
- `version-selector` en el sidebar de docs.
- `article-tree` junto al artículo.

Los slots permiten que plugins agreguen UI sin quedar hardcodeados en el core. Los temas pueden moverlos, pero deberían mantenerlos disponibles en el layout `docs`.
