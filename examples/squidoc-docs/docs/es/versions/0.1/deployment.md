---
title: "Deployment"
description: "Guía de Squidoc sobre Deployment."
---

# Deployment

Squidoc genera un sitio estático que puedes desplegar en Vercel, Netlify, GitHub Pages, Docker o cualquier hosting de archivos.

## Qué vas a configurar

El flujo normal es instalar dependencias, ejecutar `npm run build` y publicar la carpeta generada por Astro.

## Qué revisar antes de publicar

Configura `site.url` y `docs.basePath` antes del deploy para que sitemap, canonical URLs y rutas públicas salgan correctas.

## También puedes leer

[Configuración](/configuration) · [Plugins](/plugins) · [Deployment](/deployment)

## Ejemplos

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
