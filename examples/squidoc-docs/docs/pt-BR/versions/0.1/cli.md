---
title: "Referência da CLI"
description: "Guia do Squidoc sobre Referência da CLI."
---

# Referência da CLI

Esta página se concentra em a CLI do Squidoc e explica como essa parte funciona em um projeto Squidoc.

## O que você vai configurar

Você vai aprender a usar dev, build, preview, check, doctor e add no dia a dia.

## O que conferir antes de publicar

`doctor` valida o ambiente; `check` valida projeto e rotas.

## Leia também

[Configuração](/configuration) · [Plugins](/plugins) · [Deploy](/deployment)

## Exemplos

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
