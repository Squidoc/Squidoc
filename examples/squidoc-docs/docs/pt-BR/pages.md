---
title: "Páginas"
description: "Guia do Squidoc sobre Páginas."
---

# Páginas

Esta página se concentra em páginas Astro livres e explica como essa parte funciona em um projeto Squidoc.

## O que você vai configurar

Você vai aprender a criar homepages, changelogs ou páginas de produto fora da árvore de docs.

## O que conferir antes de publicar

Use apenas `page` e `docs`; rotas dinâmicas ainda não são suportadas.

## Leia também

[Configuração](/configuration) · [Plugins](/plugins) · [Deploy](/deployment)

## Exemplos

```txt
docs/
  index.md
  configuration.md
pages/
  index.astro
  changelog.astro
```

```txt
/docs/
/docs/configuration/
/
/changelog/
```

```bash
npm install @squidoc/plugin-pages
```

```ts
import { defineConfig } from "squidoc";

export default defineConfig({
  plugins: [
    "@squidoc/plugin-seo",
    "@squidoc/plugin-pages",
    "@squidoc/plugin-codeblocks",
    "@squidoc/plugin-article-tree",
  ],
});
```

```astro
---
export const squidoc = {
  title: "My Docs",
  description: "A custom homepage for my docs site.",
};
---

<section>
  <h1>My Docs</h1>
  <p>Read the latest documentation.</p>
  <a href="/docs/getting-started">Get started</a>
</section>
```

```ts
export default defineConfig({
  plugins: [
    {
      name: "@squidoc/plugin-pages",
      options: {
        pagesDir: "custom-pages",
      },
    },
  ],
});
```

```astro
---
export const squidoc = {
  title: "Changelog",
  layout: "docs",
};
---

<h1>Changelog</h1>
```
