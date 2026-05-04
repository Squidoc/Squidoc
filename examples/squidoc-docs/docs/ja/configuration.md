---
title: "設定"
description: "Squidoc の日本語ドキュメントです。"
---

# 設定

Squidoc は、プラグイン、テーマ、SEO 向けの既定設定を備えた静的ファーストのドキュメント基盤です。Markdown を書き、docs.config.ts で設定し、高速な静的サイトとして公開できます。

## プロジェクト構成

記事は docs/、任意の Astro ページは pages/、サイト情報・ナビゲーション・プラグイン・テーマは docs.config.ts で管理します。

## 拡張

プラグインは検索、SEO、コードブロック、バージョン管理、国際化、生成ファイルを追加します。テーマはレイアウト、ナビゲーション、スロットを制御します。

## 確認

公開前に npm run check、npm run build、npm run preview を実行します。

## 設定

このページは英語版ドキュメントに対応しており、サポートされるすべての言語で現在のバージョンのカバレッジをそろえます。

[始め方](/getting-started) · [プラグイン](/plugins) · [テーマ](/themes) · [デプロイ](/deployment)

## 参考例

```ts
import { defineConfig } from "squidoc";

export default defineConfig({
  site: {
    name: "My Docs",
    url: "https://docs.example.com",
    description: "Documentation powered by Squidoc",
  },
  docs: {
    basePath: "/docs",
  },
  theme: {
    name: "@squidoc/theme-basic",
    options: {
      headerLinks: [{ title: "GitHub", href: "https://github.com/Squidoc/Squidoc" }],
      footer: {
        text: "Built with Squidoc.",
        links: [
          { title: "GitHub", href: "https://github.com/Squidoc/Squidoc" },
          { title: "Configuration", path: "/docs/configuration" },
        ],
      },
    },
  },
  plugins: [
    "@squidoc/plugin-seo",
    "@squidoc/plugin-pages",
    "@squidoc/plugin-codeblocks",
    "@squidoc/plugin-article-tree",
  ],
  nav: [
    { title: "Introduction", path: "/" },
    { title: "Getting Started", path: "/getting-started" },
    { title: "Configuration", path: "/configuration" },
    { title: "Sidebar Navigation", path: "/navigation" },
    {
      title: "Customization",
      items: [
        { title: "Plugins", path: "/plugins" },
        { title: "Themes", path: "/themes" },
      ],
    },
    {
      title: "Authoring Extensions",
      path: "/developers",
      items: [
        { title: "Plugin Authoring", path: "/plugin-authoring" },
        { title: "Theme Authoring", path: "/theme-authoring" },
      ],
    },
  ],
});
```

```bash
npx squidoc add plugin @squidoc/plugin-search
npx squidoc add theme @squidoc/theme-basic
```

```ts
plugins: [
  {
    name: "@acme/squidoc-plugin-example",
    options: {
      message: "Generated from plugin options.",
    },
  },
];
```
