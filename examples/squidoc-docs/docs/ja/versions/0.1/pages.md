---
title: "ページ"
description: "Squidoc の日本語ドキュメントです。"
---

# ページ

Squidoc は、プラグイン、テーマ、SEO 向けの既定設定を備えた静的ファーストのドキュメント基盤です。Markdown を書き、docs.config.ts で設定し、高速な静的サイトとして公開できます。

## プロジェクト構成

記事は docs/、任意の Astro ページは pages/、サイト情報・ナビゲーション・プラグイン・テーマは docs.config.ts で管理します。

## 拡張

プラグインは検索、SEO、コードブロック、バージョン管理、国際化、生成ファイルを追加します。テーマはレイアウト、ナビゲーション、スロットを制御します。

## 確認

公開前に npm run check、npm run build、npm run preview を実行します。

## Pages

このページは英語版ドキュメントに対応しており、サポートされるすべての言語で現在のバージョンのカバレッジをそろえます。

[始め方](/getting-started) · [設定](/configuration) · [プラグイン](/plugins) · [テーマ](/themes) · [デプロイ](/deployment)

## 参考例

```txt
docs/
  index.md
  configuration.md
pages/
  index.astro
  changelog.astro
```

```txt
/docs/
/docs/configuration/
/
/changelog/
```

```bash
npm install @squidoc/plugin-pages
```

```ts
import { defineConfig } from "squidoc";

export default defineConfig({
  plugins: [
    "@squidoc/plugin-seo",
    "@squidoc/plugin-pages",
    "@squidoc/plugin-codeblocks",
    "@squidoc/plugin-article-tree",
  ],
});
```

```astro
---
export const squidoc = {
  title: "My Docs",
  description: "A custom homepage for my docs site.",
};
---

<section>
  <h1>My Docs</h1>
  <p>Read the latest documentation.</p>
  <a href="/docs/getting-started">Get started</a>
</section>
```

```ts
export default defineConfig({
  plugins: [
    {
      name: "@squidoc/plugin-pages",
      options: {
        pagesDir: "custom-pages",
      },
    },
  ],
});
```

```astro
---
export const squidoc = {
  title: "Changelog",
  layout: "docs",
};
---

<h1>Changelog</h1>
```
