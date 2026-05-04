---
title: "Deploy"
description: "Documentação do Squidoc em português do Brasil."
---

# Deploy

Squidoc é uma plataforma de documentação estática com plugins, temas e padrões pensados para SEO. Escreva Markdown, configure o projeto em docs.config.ts e publique um site estático rápido.

## Estrutura do projeto

Os artigos ficam em docs/, páginas Astro opcionais ficam em pages/, e docs.config.ts conecta metadados, navegação, plugins e tema.

## Extensão

Plugins adicionam busca, SEO, blocos de código, versionamento, internacionalização e arquivos gerados. Temas controlam layouts, navegação e slots.

## Validação

Antes do deploy, execute npm run check, npm run build e npm run preview.

## Deploy

Esta página acompanha a documentação em inglês para manter a mesma cobertura em todos os idiomas suportados na versão atual.

[Primeiros passos](/getting-started) · [Configuração](/configuration) · [Plugins](/plugins) · [Temas](/themes)

## Exemplos de referência

```bash
npm run check
npm run build
npm run preview
```

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

```yaml
name: Deploy Docs

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run check
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

```bash
npm run build
```
