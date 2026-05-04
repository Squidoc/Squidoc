---
title: "部署"
description: "Squidoc 简体中文文档。"
---

# 部署

Squidoc 是一个静态优先的文档平台，内置插件系统、主题系统和面向 SEO 的默认配置。你可以编写 Markdown，通过 docs.config.ts 配置项目，并发布快速的静态站点。

## 项目结构

文档文章放在 docs/，可选 Astro 页面放在 pages/，docs.config.ts 连接站点元数据、导航、插件和主题。

## 扩展

插件可以添加搜索、SEO、代码块、版本管理、国际化和生成文件。主题控制布局、导航和插件插槽。

## 验证

部署前运行 npm run check、npm run build 和 npm run preview。

## 部署

此页面与英文文档保持对应，确保所有支持的语言在当前版本中拥有相同的文档覆盖范围。

[快速开始](/getting-started) · [配置](/configuration) · [插件](/plugins) · [主题](/themes)

## 参考示例

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
