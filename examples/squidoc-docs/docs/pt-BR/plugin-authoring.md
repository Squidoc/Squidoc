---
title: "Criação de plugins"
description: "Guia do Squidoc sobre Criação de plugins."
---

# Criação de plugins

Esta página se concentra em plugins próprios e explica como essa parte funciona em um projeto Squidoc.

## O que você vai configurar

Você vai aprender a adicionar hooks de build, arquivos gerados, metadados, extensões e slots.

## O que conferir antes de publicar

Opções devem ser validadas explicitamente e documentadas.

## Leia também

[Configuração](/configuration) · [Plugins](/plugins) · [Deploy](/deployment)

## Exemplos

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
