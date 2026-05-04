---
title: "はじめ方"
description: "はじめ方 に関する Squidoc ドキュメント。"
---

# はじめ方

このページでは 新しいプロジェクト に焦点を当て、Squidoc プロジェクト内でどのように機能するかを説明します。

## 設定する内容

ここでは プロジェクト作成、依存関係のインストール、開発サーバー起動を行います。

## 公開前に確認すること

最初の公開前に `check` と `build` が通ることを確認してください。

## 関連ページ

[設定](/configuration) · [プラグイン](/plugins) · [デプロイ](/deployment)

## 例

```bash
npm create squidoc@latest my-docs
cd my-docs
npm run dev
```

```md
---
title: API Guide
description: Learn how to use the API.
---

# API Guide

Write your documentation here.
```

```ts
nav: [
  { title: "Getting Started", path: "/getting-started" },
  { title: "API Guide", path: "/api-guide" },
];
```

```bash
npm run check
npm run build
npm run preview
```
