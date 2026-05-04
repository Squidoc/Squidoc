---
title: "部署"
description: "关于部署的 Squidoc 文档。"
---

# 部署

本页聚焦 生产部署，说明它在 Squidoc 项目中的工作方式。

## 你将配置什么

你将学习如何发布到 Vercel、Netlify、GitHub Pages、Docker 或普通静态托管。

## 发布前检查

`site.url` 和 `docs.basePath` 必须匹配真实公开 URL。

## 相关阅读

[配置](/configuration) · [插件](/plugins) · [部署](/deployment)

## 示例

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
