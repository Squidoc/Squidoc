---
title: "Primeiros passos"
description: "Guia do Squidoc sobre Primeiros passos."
---

# Primeiros passos

Esta página se concentra em um novo projeto e explica como essa parte funciona em um projeto Squidoc.

## O que você vai configurar

Você vai aprender a criar o projeto, instalar dependências e iniciar o servidor de desenvolvimento.

## O que conferir antes de publicar

`check` e `build` devem passar antes da primeira publicação.

## Leia também

[Configuração](/configuration) · [Plugins](/plugins) · [Deploy](/deployment)

## Exemplos

```bash
npm create squidoc@latest my-docs
cd my-docs
npm run dev
```

```md
---
title: API Guide
description: Learn how to use the API.
---

# API Guide

Write your documentation here.
```

```ts
nav: [
  { title: "Getting Started", path: "/getting-started" },
  { title: "API Guide", path: "/api-guide" },
];
```

```bash
npm run check
npm run build
npm run preview
```
