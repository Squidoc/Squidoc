---
title: "Frontmatter"
description: "Guía de Squidoc sobre Frontmatter."
---

# Frontmatter

El frontmatter permite ajustar título, descripción y comportamiento de navegación desde cada documento.

## Qué vas a configurar

Usa campos como `title`, `description`, `nav.order`, `nav.title`, `nav.hidden` y `nav.hideChildren` cuando una página necesita metadata propia.

## Qué revisar antes de publicar

Mantén los títulos humanos y consistentes: alimentan navegación, búsqueda, SEO y árboles de artículo.

## También puedes leer

[Configuración](/configuration) · [Plugins](/plugins) · [Deployment](/deployment)

## Ejemplos

```md
---
title: API Guide
description: Learn how to use the API.
---

# API Guide
```

```md
---
title: Plugin Authoring
description: Build Squidoc plugins.
nav:
  title: Plugins
  order: 20
  hidden: false
  hideChildren: false
---
```

```md
---
title: Release Notes
description: Product release notes.
owner: Docs Team
---
```
