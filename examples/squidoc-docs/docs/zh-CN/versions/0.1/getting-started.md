---
title: "快速开始"
description: "关于快速开始的 Squidoc 文档。"
---

# 快速开始

本页聚焦 一个新项目，说明它在 Squidoc 项目中的工作方式。

## 你将配置什么

你将学习如何创建项目、安装依赖并启动开发服务器。

## 发布前检查

首次发布前请确认 `check` 和 `build` 都通过。

## 相关阅读

[配置](/configuration) · [插件](/plugins) · [部署](/deployment)

## 示例

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
