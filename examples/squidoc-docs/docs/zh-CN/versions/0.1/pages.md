---
title: "页面"
description: "Squidoc 简体中文文档。"
---

# 页面

Squidoc 是一个静态优先的文档平台，内置插件系统、主题系统和面向 SEO 的默认配置。你可以编写 Markdown，通过 docs.config.ts 配置项目，并发布快速的静态站点。

## 项目结构

文档文章放在 docs/，可选 Astro 页面放在 pages/，docs.config.ts 连接站点元数据、导航、插件和主题。

## 扩展

插件可以添加搜索、SEO、代码块、版本管理、国际化和生成文件。主题控制布局、导航和插件插槽。

## 验证

部署前运行 npm run check、npm run build 和 npm run preview。

## Pages

此页面与英文文档保持对应，确保所有支持的语言在当前版本中拥有相同的文档覆盖范围。

[快速开始](/getting-started) · [配置](/configuration) · [插件](/plugins) · [主题](/themes) · [部署](/deployment)

## 参考示例

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
