---
title: Plugin Authoring
description: Extend Squidoc with generated files, metadata, docs extensions, and theme slots.
---

# Plugin Authoring

Plugins are small packages that export a Squidoc plugin definition.

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

Users can configure that plugin with object form:

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

The setup API currently supports:

- `addGeneratedFile` for static assets such as `robots.txt`, `sitemap.xml`, `search-index.json`, and `llms.txt`.
- `addHeadTags` for site-wide metadata.
- `addPageHeadTags` for page-specific metadata such as canonical URLs.
- `addDocExtension` for formats such as `.mdx`.
- `addThemeSlot` for UI that a theme can render.
- `pluginOptions` for the current plugin's `{ name, options }` config object.

The search plugin uses generated files and a theme slot together. It writes `search-index.json`, then registers a `search` slot that the basic theme renders in the sidebar.

```ts
api.addThemeSlot({
  name: "search",
  component: "@squidoc/plugin-search/Search.astro",
  html: "<div data-squidoc-search>...</div>",
});
```

The `html` field is the current Phase 1 rendering path. Component-based slots are part of the longer-term theme API direction.

The article tree plugin uses the same slot pattern. It registers an `article-tree` slot that the basic theme renders beside the article, then builds an on-page heading tree from the rendered `h2` and `h3` elements.
