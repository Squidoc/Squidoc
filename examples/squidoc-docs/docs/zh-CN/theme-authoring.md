---
title: "主题开发"
description: "关于主题开发的 Squidoc 文档。"
---

# 主题开发

本页聚焦 自定义主题，说明它在 Squidoc 项目中的工作方式。

## 你将配置什么

你将学习如何渲染 `docs` 和 `page` 布局、导航、页脚和插件插槽。

## 发布前检查

主题需要满足布局契约，请在移动端和桌面端测试。

## 相关阅读

[配置](/configuration) · [插件](/plugins) · [部署](/deployment)

## 示例

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
