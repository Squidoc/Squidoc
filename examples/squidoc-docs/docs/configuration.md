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
    },
  },
  plugins: ["@squidoc/plugin-seo", "@squidoc/plugin-syntax-highlight"],
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

Plugins can add generated files, metadata, document extensions, and theme slots. Themes control the page structure, classes, and styling that turn discovered docs into a site.
