---
title: "プラグイン"
description: "プラグイン に関する Squidoc ドキュメント。"
---

# プラグイン

このページでは プラグイン に焦点を当て、Squidoc プロジェクト内でどのように機能するかを説明します。

## 設定する内容

ここでは 検索、SEO、コードブロック、ページ、バージョン、i18n、MDX、LLM ファイルを有効化します。

## 公開前に確認すること

バージョン管理と i18n がルートを組み合わせる場合、順序が重要です。

## 関連ページ

[設定](/configuration) · [プラグイン](/plugins) · [デプロイ](/deployment)

## 例

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
