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

The `site` object feeds page titles, metadata, generated SEO files, and theme templates. The `docs.basePath` value controls where documentation is published; it defaults to `/docs`. Navigation paths are docs-relative, so `/configuration` points at `docs/configuration.md` and publishes as `/docs/configuration` by default.

`squidoc check` catches missing navigation routes before deploy. Navigation items can be flat links, folders with `items`, folders with both a `path` and `items` when the folder has its own article, or generated sections based on your docs directory. See [Sidebar Navigation](/navigation) for manual, automatic, and mixed sidebar examples.

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

The basic theme reads `theme.options.headerLinks` for the top navigation and `theme.options.footer` for the footer. Footer links use the same `{ title, href }` or `{ title, path }` shape as header links. Theme header and footer paths are site routes, so link to `/docs/configuration` when the docs base path is `/docs`.

For page-level metadata, use [frontmatter](/frontmatter). For command behavior, see the [CLI Reference](/cli).
