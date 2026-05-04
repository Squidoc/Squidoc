---
title: "Déploiement"
description: "Documentation Squidoc en français."
---

# Déploiement

Squidoc est une plateforme de documentation statique avec plugins, thèmes et réglages SEO par défaut. Écrivez du Markdown, configurez docs.config.ts, puis publiez un site rapide et statique.

## Structure du projet

Les articles vivent dans docs/, les pages Astro facultatives dans pages/, et docs.config.ts relie les métadonnées, la navigation, les plugins et le thème.

## Extension

Les plugins ajoutent recherche, SEO, blocs de code, versionnement, internationalisation et fichiers générés. Les thèmes contrôlent les layouts, la navigation et les slots.

## Vérification

Exécutez npm run check, npm run build et npm run preview avant le déploiement.

## Déploiement

Cette page suit la documentation anglaise afin que chaque langue prise en charge garde la même couverture pour la version actuelle.

[Bien démarrer](/getting-started) · [Configuration](/configuration) · [Plugins](/plugins) · [Thèmes](/themes)

## Exemples de référence

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
