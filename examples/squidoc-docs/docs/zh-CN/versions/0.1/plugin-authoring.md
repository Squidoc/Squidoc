---
title: "插件开发"
description: "关于插件开发的 Squidoc 文档。"
---

# 插件开发

本页聚焦 自定义插件，说明它在 Squidoc 项目中的工作方式。

## 你将配置什么

你将学习如何添加 build hook、生成文件、元数据、文档扩展和插槽。

## 发布前检查

选项应显式验证并写入用户文档。

## 相关阅读

[配置](/configuration) · [插件](/plugins) · [部署](/deployment)

## 示例

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
