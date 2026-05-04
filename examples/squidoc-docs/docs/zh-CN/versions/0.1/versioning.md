---
title: "版本管理"
description: "Squidoc 简体中文文档。"
---

# 版本管理

Squidoc 是一个静态优先的文档平台，内置插件系统、主题系统和面向 SEO 的默认配置。你可以编写 Markdown，通过 docs.config.ts 配置项目，并发布快速的静态站点。

## 项目结构

文档文章放在 docs/，可选 Astro 页面放在 pages/，docs.config.ts 连接站点元数据、导航、插件和主题。

## 扩展

插件可以添加搜索、SEO、代码块、版本管理、国际化和生成文件。主题控制布局、导航和插件插槽。

## 验证

部署前运行 npm run check、npm run build 和 npm run preview。

## Versioning

此页面与英文文档保持对应，确保所有支持的语言在当前版本中拥有相同的文档覆盖范围。

[快速开始](/getting-started) · [配置](/configuration) · [插件](/plugins) · [主题](/themes) · [部署](/deployment)

## 参考示例

```bash
npx squidoc add plugin @squidoc/plugin-versions
```

```ts
export default defineConfig({
  plugins: [
    "@squidoc/plugin-seo",
    "@squidoc/plugin-codeblocks",
    "@squidoc/plugin-article-tree",
    {
      name: "@squidoc/plugin-versions",
      options: {
        current: {
          name: "1.0",
          label: "1.0",
        },
        versions: [
          {
            name: "0.9",
            label: "0.9",
          },
        ],
      },
    },
  ],
});
```

```txt
docs/
  index.md
  configuration.md
  plugin-authoring.md
```

```txt
docs/
  versions/
    0.9/
      index.md
      configuration.md
      plugin-authoring.md
```

```ts
{
  name: "@squidoc/plugin-versions",
  options: {
    current: { name: "2.0", label: "2.0" },
    versions: [
      {
        name: "1.0",
        label: "1.0",
        docsPrefix: "archive/v1",
        routePrefix: "/v1",
      },
    ],
  },
}
```

```ts
{
  name: "@squidoc/plugin-versions",
  options: {
    current: {
      name: "next",
      label: "Next",
      routePrefix: "/next",
      hidden: true,
    },
    versions: [
      {
        name: "0.1",
        label: "0.1",
        routePrefix: "/",
        current: true,
      },
    ],
  },
}
```

```json
[
  {
    "name": "1.0",
    "label": "1.0",
    "routePrefix": "/docs",
    "current": true,
    "routes": ["/docs", "/docs/configuration"]
  },
  {
    "name": "0.9",
    "label": "0.9",
    "routePrefix": "/docs/versions/0.9",
    "current": false,
    "routes": ["/docs/versions/0.9", "/docs/versions/0.9/configuration"]
  }
]
```

```ts
{
  squidocVersion: "0.9",
  squidocVersionLabel: "0.9",
  squidocVersionRoutePrefix: "/docs/versions/0.9",
  squidocVersionCurrent: false,
}
```
