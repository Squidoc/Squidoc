---
title: "Frontmatter"
description: "Documentação do Squidoc em português do Brasil."
---

# Frontmatter

Squidoc é uma plataforma de documentação estática com plugins, temas e padrões pensados para SEO. Escreva Markdown, configure o projeto em docs.config.ts e publique um site estático rápido.

## Estrutura do projeto

Os artigos ficam em docs/, páginas Astro opcionais ficam em pages/, e docs.config.ts conecta metadados, navegação, plugins e tema.

## Extensão

Plugins adicionam busca, SEO, blocos de código, versionamento, internacionalização e arquivos gerados. Temas controlam layouts, navegação e slots.

## Validação

Antes do deploy, execute npm run check, npm run build e npm run preview.

## Frontmatter

Esta página acompanha a documentação em inglês para manter a mesma cobertura em todos os idiomas suportados na versão atual.

[Primeiros passos](/getting-started) · [Configuração](/configuration) · [Plugins](/plugins) · [Temas](/themes) · [Deploy](/deployment)

## Exemplos de referência

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
