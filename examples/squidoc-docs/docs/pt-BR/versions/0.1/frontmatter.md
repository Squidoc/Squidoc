---
title: "Frontmatter"
description: "Guia do Squidoc sobre Frontmatter."
---

# Frontmatter

Esta página se concentra em metadados de documento e explica como essa parte funciona em um projeto Squidoc.

## O que você vai configurar

Você vai aprender a controlar título, descrição e navegação direto no Markdown.

## O que conferir antes de publicar

Esses campos alimentam navegação, busca e SEO; mantenha-os curtos e claros.

## Leia também

[Configuração](/configuration) · [Plugins](/plugins) · [Deploy](/deployment)

## Exemplos

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
