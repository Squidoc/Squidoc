---
title: "Referência da CLI"
description: "Documentação do Squidoc em português do Brasil."
---

# Referência da CLI

Squidoc é uma plataforma de documentação estática com plugins, temas e padrões pensados para SEO. Escreva Markdown, configure o projeto em docs.config.ts e publique um site estático rápido.

## Estrutura do projeto

Os artigos ficam em docs/, páginas Astro opcionais ficam em pages/, e docs.config.ts conecta metadados, navegação, plugins e tema.

## Extensão

Plugins adicionam busca, SEO, blocos de código, versionamento, internacionalização e arquivos gerados. Temas controlam layouts, navegação e slots.

## Validação

Antes do deploy, execute npm run check, npm run build e npm run preview.

## CLI

Esta página acompanha a documentação em inglês para manter a mesma cobertura em todos os idiomas suportados na versão atual.

[Primeiros passos](/getting-started) · [Configuração](/configuration) · [Plugins](/plugins) · [Temas](/themes) · [Deploy](/deployment)

## Exemplos de referência

```json
{
  "scripts": {
    "dev": "squidoc dev",
    "build": "squidoc build",
    "preview": "squidoc preview",
    "check": "squidoc check",
    "doctor": "squidoc doctor"
  }
}
```

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run preview
```

```bash
npm run check
```

```bash
npm run doctor
```

```bash
npx squidoc add plugin @squidoc/plugin-search
npx squidoc add theme @squidoc/theme-basic
```
