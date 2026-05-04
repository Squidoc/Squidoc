---
title: "Criar plugins"
description: "Documentação do Squidoc em português do Brasil."
---

# Criar plugins

Squidoc é uma plataforma de documentação estática com plugins, temas e padrões pensados para SEO. Escreva Markdown, configure o projeto em docs.config.ts e publique um site estático rápido.

## Estrutura do projeto

Os artigos ficam em docs/, páginas Astro opcionais ficam em pages/, e docs.config.ts conecta metadados, navegação, plugins e tema.

## Extensão

Plugins adicionam busca, SEO, blocos de código, versionamento, internacionalização e arquivos gerados. Temas controlam layouts, navegação e slots.

## Validação

Antes do deploy, execute npm run check, npm run build e npm run preview.

## Criar plugins

Esta página acompanha a documentação em inglês para manter a mesma cobertura em todos os idiomas suportados na versão atual.

[Primeiros passos](/getting-started) · [Configuração](/configuration) · [Plugins](/plugins) · [Temas](/themes) · [Deploy](/deployment)

## Exemplos de referência

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
