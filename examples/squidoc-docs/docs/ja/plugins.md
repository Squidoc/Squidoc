---
title: "プラグイン"
description: "Squidoc の日本語ドキュメントです。"
---

# プラグイン

Squidoc は、プラグイン、テーマ、SEO 向けの既定設定を備えた静的ファーストのドキュメント基盤です。Markdown を書き、docs.config.ts で設定し、高速な静的サイトとして公開できます。

## プロジェクト構成

記事は docs/、任意の Astro ページは pages/、サイト情報・ナビゲーション・プラグイン・テーマは docs.config.ts で管理します。

## 拡張

プラグインは検索、SEO、コードブロック、バージョン管理、国際化、生成ファイルを追加します。テーマはレイアウト、ナビゲーション、スロットを制御します。

## 確認

公開前に npm run check、npm run build、npm run preview を実行します。

## Plugins

このページは英語版ドキュメントに対応しており、サポートされるすべての言語で現在のバージョンのカバレッジをそろえます。

[始め方](/getting-started) · [設定](/configuration) · [テーマ](/themes) · [デプロイ](/deployment)

## 参考例

```bash
npx squidoc add plugin @squidoc/plugin-search
```

```bash
npm install @squidoc/plugin-search
```

```ts
export default defineConfig({
  plugins: [
    "@squidoc/plugin-seo",
    "@squidoc/plugin-pages",
    "@squidoc/plugin-codeblocks",
    "@squidoc/plugin-article-tree",
    "@squidoc/plugin-search",
  ],
});
```

```ts
plugins: [
  {
    name: "@acme/squidoc-plugin-example",
    options: {
      message: "Hello from plugin options.",
    },
  },
];
```

```ts
plugins: ["@squidoc/plugin-seo"];
```

```ts
plugins: [
  {
    name: "@squidoc/plugin-codeblocks",
    options: {
      theme: "github-light",
    },
  },
];
```

```ts
plugins: [
  {
    name: "@squidoc/plugin-pages",
    options: {
      pagesDir: "pages",
    },
  },
];
```

```astro
---
export const squidoc = {
  title: "Changelog",
  description: "Product updates and release notes.",
  layout: "page",
};
---
```

```ts
plugins: ["@squidoc/plugin-article-tree"];
```

```ts
plugins: ["@squidoc/plugin-search"];
```

```ts
plugins: ["@squidoc/plugin-mdx"];
```

```ts
plugins: ["@squidoc/plugin-llms"];
```

```ts
plugins: [
  {
    name: "@squidoc/plugin-versions",
    options: {
      current: {
        name: "1.0",
        label: "1.0",
      },
      versions: [
        {
          name: "0.9",
          label: "0.9",
          docsPrefix: "versions/0.9",
          routePrefix: "/versions/0.9",
        },
      ],
    },
  },
];
```

```ts
plugins: [
  {
    name: "@squidoc/plugin-i18n",
    options: {
      defaultLocale: "en",
      locales: [
        { code: "en", label: "English" },
        { code: "es", label: "Español" },
      ],
    },
  },
];
```

```ts
plugins: [
  "@squidoc/plugin-seo",
  "@squidoc/plugin-pages",
  "@squidoc/plugin-codeblocks",
  "@squidoc/plugin-article-tree",
];
```
