---
title: "CLI 参考"
description: "关于CLI 参考的 Squidoc 文档。"
---

# CLI 参考

本页聚焦 Squidoc CLI，说明它在 Squidoc 项目中的工作方式。

## 你将配置什么

你将学习如何日常使用 dev、build、preview、check、doctor 和 add。

## 发布前检查

`doctor` 检查环境，`check` 检查项目和路由问题。

## 相关阅读

[配置](/configuration) · [插件](/plugins) · [部署](/deployment)

## 示例

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
