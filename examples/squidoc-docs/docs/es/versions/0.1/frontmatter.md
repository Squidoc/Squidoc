---
title: Frontmatter
description: Referencia de campos frontmatter soportados por documentos Squidoc.
---

# Frontmatter

Frontmatter es el bloque YAML al inicio de un documento Markdown o MDX. Squidoc lo lee antes de renderizar la página.

```md
---
title: Guía API
description: Aprende a usar la API.
---

# Guía API
```

## Campos soportados

`title` define el título usado por temas, SEO, índices generados y títulos del navegador. Si se omite, Squidoc usa el primer `# Heading` o deriva un título desde el nombre del archivo.

`description` define la descripción usada por SEO, resultados de búsqueda y archivos para LLMs. Debe ser texto plano y útil fuera de contexto.

`nav.title` reemplaza la etiqueta usada por sidebars generados.

`nav.order` ordena páginas en sidebars generados. Números menores aparecen primero.

`nav.hidden` excluye la página del sidebar generado sin dejar de publicarla.

`nav.hideChildren` excluye una página oculta de carpeta y todos sus hijos.

```md
---
title: Crear plugins
description: Construye plugins Squidoc.
nav:
  title: Plugins
  order: 20
  hidden: false
  hideChildren: false
---
```

## Campos no soportados

Campos adicionales se preservan en los datos de página para uso futuro de temas y plugins, pero el core solo asigna comportamiento a `title`, `description` y `nav`.
