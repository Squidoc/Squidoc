---
title: "サイドバー ナビゲーション"
description: "サイドバー ナビゲーション に関する Squidoc ドキュメント。"
---

# サイドバー ナビゲーション

このページでは サイドバー に焦点を当て、Squidoc プロジェクト内でどのように機能するかを説明します。

## 設定する内容

ここでは 手動、自動、混合のナビゲーションを docs ツリーから作ります。

## 公開前に確認すること

非表示フォルダーと生成セクションは、想定外のリンク欠落がないか確認してください。

## 関連ページ

[設定](/configuration) · [プラグイン](/plugins) · [デプロイ](/deployment)

## 例

```ts
export default defineConfig({
  nav: [
    { title: "Introduction", path: "/" },
    { title: "Configuration", path: "/configuration" },
    {
      title: "Developers",
      path: "/developers",
      items: [
        { title: "Plugin Authoring", path: "/plugin-authoring" },
        { title: "Theme Authoring", path: "/theme-authoring" },
      ],
    },
  ],
});
```

```ts
export default defineConfig({
  nav: "auto",
});
```

```txt
docs/
  index.md
  getting-started.md
  developers/
    index.md
    plugin-authoring.md
    theme-authoring.md
```

```ts
export default defineConfig({
  nav: {
    autogenerate: {
      from: "/developers",
    },
  },
});
```

```ts
export default defineConfig({
  nav: [
    { title: "Introduction", path: "/" },
    {
      title: "Developers",
      autogenerate: {
        from: "/developers",
      },
    },
    {
      title: "Reference",
      items: [{ title: "CLI", path: "/cli" }],
    },
  ],
});
```

```ts
{
  title: "Developers",
  autogenerate: {
    from: "/developers",
  },
  items: [
    { title: "External API", path: "/external-api" },
  ],
}
```

```ts
{
  title: "Developers",
  autogenerate: {
    from: "/developers",
    generatedPosition: "after",
  },
  items: [
    { title: "Overview", path: "/developers/overview" },
  ],
}
```

```ts
export default defineConfig({
  nav: {
    autogenerate: {
      from: "/",
      exclude: ["versions/**", "es/**"],
    },
  },
});
```

```md
---
title: Plugin Authoring
nav:
  title: Plugins
  order: 20
---
```

```md
---
title: Internal Migration Notes
nav:
  hidden: true
---
```

```md
---
title: Internal Notes
nav:
  hidden: true
  hideChildren: true
---
```
