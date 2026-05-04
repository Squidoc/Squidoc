---
title: "配置"
description: "Squidoc 简体中文文档。"
---

# 配置

Squidoc 是一个静态优先的文档平台，内置插件系统、主题系统和面向 SEO 的默认配置。你可以编写 Markdown，通过 docs.config.ts 配置项目，并发布快速的静态站点。

## 项目结构

文档文章放在 docs/，可选 Astro 页面放在 pages/，docs.config.ts 连接站点元数据、导航、插件和主题。

## 扩展

插件可以添加搜索、SEO、代码块、版本管理、国际化和生成文件。主题控制布局、导航和插件插槽。

## 验证

部署前运行 npm run check、npm run build 和 npm run preview。

## 配置

此页面与英文文档保持对应，确保所有支持的语言在当前版本中拥有相同的文档覆盖范围。

[快速开始](/getting-started) · [插件](/plugins) · [主题](/themes) · [部署](/deployment)

## 参考示例

```ts
import { defineConfig } from "squidoc";

export default defineConfig({
  site: {
    name: "My Docs",
    url: "https://docs.example.com",
    description: "Documentation powered by Squidoc",
  },
  docs: {
    basePath: "/docs",
  },
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
  plugins: [
    "@squidoc/plugin-seo",
    "@squidoc/plugin-pages",
    "@squidoc/plugin-codeblocks",
    "@squidoc/plugin-article-tree",
  ],
  nav: [
    { title: "Introduction", path: "/" },
    { title: "Getting Started", path: "/getting-started" },
    { title: "Configuration", path: "/configuration" },
    { title: "Sidebar Navigation", path: "/navigation" },
    {
      title: "Customization",
      items: [
        { title: "Plugins", path: "/plugins" },
        { title: "Themes", path: "/themes" },
      ],
    },
    {
      title: "Authoring Extensions",
      path: "/developers",
      items: [
        { title: "Plugin Authoring", path: "/plugin-authoring" },
        { title: "Theme Authoring", path: "/theme-authoring" },
      ],
    },
  ],
});
```

```bash
npx squidoc add plugin @squidoc/plugin-search
npx squidoc add theme @squidoc/theme-basic
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
