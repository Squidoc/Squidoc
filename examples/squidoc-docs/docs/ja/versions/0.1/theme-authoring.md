---
title: "テーマ作成"
description: "テーマ作成 に関する Squidoc ドキュメント。"
---

# テーマ作成

このページでは 独自テーマ に焦点を当て、Squidoc プロジェクト内でどのように機能するかを説明します。

## 設定する内容

ここでは `docs` と `page` レイアウト、ナビゲーション、フッター、プラグインスロットを描画します。

## 公開前に確認すること

テーマはレイアウト契約を満たす必要があるため、モバイルとデスクトップで確認してください。

## 関連ページ

[設定](/configuration) · [プラグイン](/plugins) · [デプロイ](/deployment)

## 例

```ts
import { defineTheme } from "@squidoc/core";

export default defineTheme({
  name: "@acme/squidoc-theme",
  layouts: {
    docs: "./layouts/Docs.astro",
    page: "./layouts/Page.astro",
  },
  renderer: {
    globalCss: "...",
    classes: {
      shell: "docs-shell",
      sidebar: "docs-sidebar",
      content: "docs-content",
    },
  },
});
```

```astro
---
export const squidoc = {
  title: "Changelog",
  layout: "docs",
};
---
```
