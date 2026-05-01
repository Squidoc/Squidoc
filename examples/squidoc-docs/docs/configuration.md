---
title: Configuration
description: Configure site metadata, navigation, plugins, and themes.
---

# Configuration

Squidoc projects are configured with `docs.config.ts`.

```ts
import { defineConfig } from "squidoc";

export default defineConfig({
  site: {
    name: "My Docs",
    url: "https://docs.example.com",
    description: "Documentation powered by Squidoc",
  },
  theme: {
    name: "@squidoc/theme-basic",
    options: {
      primaryColor: "#2563eb",
      headerLinks: [{ title: "GitHub", href: "https://github.com/Squidoc/Squidoc" }],
      footer: {
        text: "Built with Squidoc.",
        links: [
          { title: "GitHub", href: "https://github.com/Squidoc/Squidoc" },
          { title: "Configuration", path: "/configuration" },
        ],
      },
    },
  },
  plugins: [
    "@squidoc/plugin-seo",
    "@squidoc/plugin-codeblocks",
    "@squidoc/plugin-article-tree",
  ],
  nav: [
    { title: "Getting Started", path: "/getting-started" },
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

The `site` object feeds page titles, metadata, generated SEO files, and theme templates. Navigation paths must point to discovered docs routes, and `squidoc check` catches missing routes before deploy. Navigation items can be flat links, folders with `items`, or folders with both a `path` and `items` when the folder has its own article.

Add plugins and themes with the CLI:

```bash
npx squidoc add plugin @squidoc/plugin-search
npx squidoc add theme @squidoc/theme-basic
```

Plugins can add generated files, metadata, document extensions, and theme slots. Use a string for default plugin behavior, or `{ name, options }` when a plugin exposes configuration:

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

Themes control the page structure, classes, and styling that turn discovered docs into a site.

The basic theme reads `theme.options.headerLinks` for the top navigation and `theme.options.footer` for the footer. Footer links use the same `{ title, href }` or `{ title, path }` shape as header links.
