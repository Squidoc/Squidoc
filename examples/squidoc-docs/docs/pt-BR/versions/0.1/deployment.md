---
title: "Deploy"
description: "Guia do Squidoc sobre Deploy."
---

# Deploy

Esta página se concentra em deploys de produção e explica como essa parte funciona em um projeto Squidoc.

## O que você vai configurar

Você vai aprender a publicar builds estáticos na Vercel, Netlify, GitHub Pages, Docker ou hospedagem simples.

## O que conferir antes de publicar

`site.url` e `docs.basePath` precisam bater com a URL pública real.

## Leia também

[Configuração](/configuration) · [Plugins](/plugins) · [Deploy](/deployment)

## Exemplos

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
