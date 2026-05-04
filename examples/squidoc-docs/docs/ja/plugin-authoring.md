---
title: "プラグイン作成"
description: "Squidoc の日本語ドキュメントです。"
---

# プラグイン作成

Squidoc は、プラグイン、テーマ、SEO 向けの既定設定を備えた静的ファーストのドキュメント基盤です。Markdown を書き、docs.config.ts で設定し、高速な静的サイトとして公開できます。

## プロジェクト構成

記事は docs/、任意の Astro ページは pages/、サイト情報・ナビゲーション・プラグイン・テーマは docs.config.ts で管理します。

## 拡張

プラグインは検索、SEO、コードブロック、バージョン管理、国際化、生成ファイルを追加します。テーマはレイアウト、ナビゲーション、スロットを制御します。

## 確認

公開前に npm run check、npm run build、npm run preview を実行します。

## プラグイン作成

このページは英語版ドキュメントに対応しており、サポートされるすべての言語で現在のバージョンのカバレッジをそろえます。

[始め方](/getting-started) · [設定](/configuration) · [プラグイン](/plugins) · [テーマ](/themes) · [デプロイ](/deployment)

## 参考例

```ts
import { definePlugin } from "@squidoc/core";

export default definePlugin({
  name: "@acme/squidoc-plugin-example",
  setup(api) {
    const message =
      typeof api.pluginOptions.message === "string"
        ? api.pluginOptions.message
        : "Generated during squidoc build.";

    api.addGeneratedFile({
      path: "example.txt",
      contents: `${message}\n`,
    });
  },
});
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

```ts
api.addThemeSlot({
  name: "search",
  component: "@squidoc/plugin-search/Search.astro",
  html: "<div data-squidoc-search>...</div>",
});
```
