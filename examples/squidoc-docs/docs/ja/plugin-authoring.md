---
title: "プラグイン作成"
description: "プラグイン作成 に関する Squidoc ドキュメント。"
---

# プラグイン作成

このページでは 独自プラグイン に焦点を当て、Squidoc プロジェクト内でどのように機能するかを説明します。

## 設定する内容

ここでは build フック、生成ファイル、メタデータ、文書拡張、スロットを追加します。

## 公開前に確認すること

オプションは明示的に検証し、ユーザー向け docs に書いてください。

## 関連ページ

[設定](/configuration) · [プラグイン](/plugins) · [デプロイ](/deployment)

## 例

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
