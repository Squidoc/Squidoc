---
title: "Frontmatter"
description: "Frontmatter に関する Squidoc ドキュメント。"
---

# Frontmatter

このページでは ドキュメントのメタデータ に焦点を当て、Squidoc プロジェクト内でどのように機能するかを説明します。

## 設定する内容

ここでは Markdown 内でタイトル、説明、ナビゲーション動作を制御します。

## 公開前に確認すること

これらはナビゲーション、検索、SEO に使われるため短く明確にしてください。

## 関連ページ

[設定](/configuration) · [プラグイン](/plugins) · [デプロイ](/deployment)

## 例

```md
---
title: API Guide
description: Learn how to use the API.
---

# API Guide
```

```md
---
title: Plugin Authoring
description: Build Squidoc plugins.
nav:
  title: Plugins
  order: 20
  hidden: false
  hideChildren: false
---
```

```md
---
title: Release Notes
description: Product release notes.
owner: Docs Team
---
```
