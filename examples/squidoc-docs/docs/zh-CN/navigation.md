---
title: "侧边栏导航"
description: "关于侧边栏导航的 Squidoc 文档。"
---

# 侧边栏导航

本页聚焦 侧边栏，说明它在 Squidoc 项目中的工作方式。

## 你将配置什么

你将学习如何从 docs 目录创建手动、自动或混合导航。

## 发布前检查

测试隐藏文件夹和生成区块，避免导航项意外消失。

## 相关阅读

[配置](/configuration) · [插件](/plugins) · [部署](/deployment)

## 示例

```ts
export default defineConfig({
  nav: [
    { title: "Introduction", path: "/" },
    { title: "Configuration", path: "/configuration" },
    {
      title: "Developers",
      path: "/developers",
      items: [
        { title: "Plugin Authoring", path: "/plugin-authoring" },
        { title: "Theme Authoring", path: "/theme-authoring" },
      ],
    },
  ],
});
```

```ts
export default defineConfig({
  nav: "auto",
});
```

```txt
docs/
  index.md
  getting-started.md
  developers/
    index.md
    plugin-authoring.md
    theme-authoring.md
```

```ts
export default defineConfig({
  nav: {
    autogenerate: {
      from: "/developers",
    },
  },
});
```

```ts
export default defineConfig({
  nav: [
    { title: "Introduction", path: "/" },
    {
      title: "Developers",
      autogenerate: {
        from: "/developers",
      },
    },
    {
      title: "Reference",
      items: [{ title: "CLI", path: "/cli" }],
    },
  ],
});
```

```ts
{
  title: "Developers",
  autogenerate: {
    from: "/developers",
  },
  items: [
    { title: "External API", path: "/external-api" },
  ],
}
```

```ts
{
  title: "Developers",
  autogenerate: {
    from: "/developers",
    generatedPosition: "after",
  },
  items: [
    { title: "Overview", path: "/developers/overview" },
  ],
}
```

```ts
export default defineConfig({
  nav: {
    autogenerate: {
      from: "/",
      exclude: ["versions/**", "es/**"],
    },
  },
});
```

```md
---
title: Plugin Authoring
nav:
  title: Plugins
  order: 20
---
```

```md
---
title: Internal Migration Notes
nav:
  hidden: true
---
```

```md
---
title: Internal Notes
nav:
  hidden: true
  hideChildren: true
---
```
