---
title: "Criação de temas"
description: "Guia do Squidoc sobre Criação de temas."
---

# Criação de temas

Esta página se concentra em temas próprios e explica como essa parte funciona em um projeto Squidoc.

## O que você vai configurar

Você vai aprender a renderizar layouts `docs` e `page`, navegação, rodapé e slots de plugins.

## O que conferir antes de publicar

Teste temas no mobile e desktop porque eles cumprem contratos de layout.

## Leia também

[Configuração](/configuration) · [Plugins](/plugins) · [Deploy](/deployment)

## Exemplos

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
