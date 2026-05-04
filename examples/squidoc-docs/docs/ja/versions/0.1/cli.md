---
title: "CLI リファレンス"
description: "CLI リファレンス に関する Squidoc ドキュメント。"
---

# CLI リファレンス

このページでは Squidoc CLI に焦点を当て、Squidoc プロジェクト内でどのように機能するかを説明します。

## 設定する内容

ここでは dev、build、preview、check、doctor、add を日常的に使います。

## 公開前に確認すること

`doctor` は環境を、`check` はプロジェクトとルートの問題を確認します。

## 関連ページ

[設定](/configuration) · [プラグイン](/plugins) · [デプロイ](/deployment)

## 例

```json
{
  "scripts": {
    "dev": "squidoc dev",
    "build": "squidoc build",
    "preview": "squidoc preview",
    "check": "squidoc check",
    "doctor": "squidoc doctor"
  }
}
```

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run preview
```

```bash
npm run check
```

```bash
npm run doctor
```

```bash
npx squidoc add plugin @squidoc/plugin-search
npx squidoc add theme @squidoc/theme-basic
```
