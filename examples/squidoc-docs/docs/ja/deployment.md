---
title: "デプロイ"
description: "Squidoc の日本語ドキュメントです。"
---

# デプロイ

Squidoc は、プラグイン、テーマ、SEO 向けの既定設定を備えた静的ファーストのドキュメント基盤です。Markdown を書き、docs.config.ts で設定し、高速な静的サイトとして公開できます。

## プロジェクト構成

記事は docs/、任意の Astro ページは pages/、サイト情報・ナビゲーション・プラグイン・テーマは docs.config.ts で管理します。

## 拡張

プラグインは検索、SEO、コードブロック、バージョン管理、国際化、生成ファイルを追加します。テーマはレイアウト、ナビゲーション、スロットを制御します。

## 確認

公開前に npm run check、npm run build、npm run preview を実行します。

## デプロイ

このページは英語版ドキュメントに対応しており、サポートされるすべての言語で現在のバージョンのカバレッジをそろえます。

[始め方](/getting-started) · [設定](/configuration) · [プラグイン](/plugins) · [テーマ](/themes)

## 参考例

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
