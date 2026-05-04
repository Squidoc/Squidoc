---
title: "Frontmatter"
description: "关于Frontmatter的 Squidoc 文档。"
---

# Frontmatter

本页聚焦 文档元数据，说明它在 Squidoc 项目中的工作方式。

## 你将配置什么

你将学习如何直接在 Markdown 中控制标题、描述和导航行为。

## 发布前检查

这些字段会影响导航、搜索和 SEO，请保持简短清晰。

## 相关阅读

[配置](/configuration) · [插件](/plugins) · [部署](/deployment)

## 示例

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
