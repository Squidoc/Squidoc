---
title: "テーマ"
description: "テーマ に関する Squidoc ドキュメント。"
---

# テーマ

このページでは テーマ に焦点を当て、Squidoc プロジェクト内でどのように機能するかを説明します。

## 設定する内容

ここでは レイアウト、ナビゲーション、フッター、スロット、見た目の設定を差し替えます。

## 公開前に確認すること

テーマは安定した `docs` と `page` レイアウトをサポートする必要があります。

## 関連ページ

[設定](/configuration) · [プラグイン](/plugins) · [デプロイ](/deployment)

## 例

```ts
export default defineConfig({
  theme: "@squidoc/theme-basic",
});
```

```ts
export default defineConfig({
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
});
```

```bash
npx squidoc add theme @acme/squidoc-theme
```

```bash
npm install @acme/squidoc-theme
```

```ts
export default defineConfig({
  theme: "@acme/squidoc-theme",
});
```

```ts
primaryColor: "#4a54df";
```

```ts
headerLinks: [
  { title: "GitHub", href: "https://github.com/Squidoc/Squidoc" },
  { title: "Deployment", path: "/docs/deployment" },
];
```

```ts
footer: {
  text: "Built with Squidoc.",
  links: [
    { title: "GitHub", href: "https://github.com/Squidoc/Squidoc" },
    { title: "Plugins", path: "/docs/plugins" },
  ],
};
```
