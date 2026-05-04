---
title: "バージョン管理"
description: "バージョン管理 に関する Squidoc ドキュメント。"
---

# バージョン管理

このページでは バージョン付きドキュメント に焦点を当て、Squidoc プロジェクト内でどのように機能するかを説明します。

## 設定する内容

ここでは 現在版とアーカイブ版を安定したルートで公開します。

## 公開前に確認すること

バージョン間で欠けたページを確認し、検索結果にはバージョンを明示してください。

## 関連ページ

[設定](/configuration) · [プラグイン](/plugins) · [デプロイ](/deployment)

## 例

```bash
npx squidoc add plugin @squidoc/plugin-versions
```

```ts
export default defineConfig({
  plugins: [
    "@squidoc/plugin-seo",
    "@squidoc/plugin-codeblocks",
    "@squidoc/plugin-article-tree",
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
          },
        ],
      },
    },
  ],
});
```

```txt
docs/
  index.md
  configuration.md
  plugin-authoring.md
```

```txt
docs/
  versions/
    0.9/
      index.md
      configuration.md
      plugin-authoring.md
```

```ts
{
  name: "@squidoc/plugin-versions",
  options: {
    current: { name: "2.0", label: "2.0" },
    versions: [
      {
        name: "1.0",
        label: "1.0",
        docsPrefix: "archive/v1",
        routePrefix: "/v1",
      },
    ],
  },
}
```

```ts
{
  name: "@squidoc/plugin-versions",
  options: {
    current: {
      name: "next",
      label: "Next",
      routePrefix: "/next",
      hidden: true,
    },
    versions: [
      {
        name: "0.1",
        label: "0.1",
        routePrefix: "/",
        current: true,
      },
    ],
  },
}
```

```json
[
  {
    "name": "1.0",
    "label": "1.0",
    "routePrefix": "/docs",
    "current": true,
    "routes": ["/docs", "/docs/configuration"]
  },
  {
    "name": "0.9",
    "label": "0.9",
    "routePrefix": "/docs/versions/0.9",
    "current": false,
    "routes": ["/docs/versions/0.9", "/docs/versions/0.9/configuration"]
  }
]
```

```ts
{
  squidocVersion: "0.9",
  squidocVersionLabel: "0.9",
  squidocVersionRoutePrefix: "/docs/versions/0.9",
  squidocVersionCurrent: false,
}
```
