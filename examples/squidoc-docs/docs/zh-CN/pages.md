---
title: "页面"
description: "关于页面的 Squidoc 文档。"
---

# 页面

本页聚焦 自定义 Astro 页面，说明它在 Squidoc 项目中的工作方式。

## 你将配置什么

你将学习如何在 docs 树之外构建首页、更新日志或产品页面。

## 发布前检查

仅使用 `page` 和 `docs` 布局；动态路由暂不支持。

## 相关阅读

[配置](/configuration) · [插件](/plugins) · [部署](/deployment)

## 示例

```txt
docs/
  index.md
  configuration.md
pages/
  index.astro
  changelog.astro
```

```txt
/docs/
/docs/configuration/
/
/changelog/
```

```bash
npm install @squidoc/plugin-pages
```

```ts
import { defineConfig } from "squidoc";

export default defineConfig({
  plugins: [
    "@squidoc/plugin-seo",
    "@squidoc/plugin-pages",
    "@squidoc/plugin-codeblocks",
    "@squidoc/plugin-article-tree",
  ],
});
```

```astro
---
export const squidoc = {
  title: "My Docs",
  description: "A custom homepage for my docs site.",
};
---

<section>
  <h1>My Docs</h1>
  <p>Read the latest documentation.</p>
  <a href="/docs/getting-started">Get started</a>
</section>
```

```ts
export default defineConfig({
  plugins: [
    {
      name: "@squidoc/plugin-pages",
      options: {
        pagesDir: "custom-pages",
      },
    },
  ],
});
```

```astro
---
export const squidoc = {
  title: "Changelog",
  layout: "docs",
};
---

<h1>Changelog</h1>
```
