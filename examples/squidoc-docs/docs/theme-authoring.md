---
title: Theme Authoring
description: Shape Squidoc pages with theme classes, CSS, layout intent, and slots.
---

# Theme Authoring

Themes control the structure and presentation of a Squidoc site.

```ts
import { defineTheme } from "@squidoc/core";

export default defineTheme({
  name: "@acme/squidoc-theme",
  layouts: {
    doc: "./layouts/DocPage.astro",
  },
  renderer: {
    globalCss: "...",
    classes: {
      shell: "docs-shell",
      sidebar: "docs-sidebar",
      content: "docs-content",
    },
  },
});
```

The current renderer uses the `renderer` object to provide global CSS and class names for the generated Astro pages. This keeps the default site static, fast, and simple while still letting themes change the look and structure.

Themes can also receive plugin slots. The basic theme renders the `search` slot in the sidebar, which lets `@squidoc/plugin-search` add UI without being hardcoded into the core renderer.

Powerful themes are a core design goal. Themes should be able to change navigation placement, headers, footers, widgets, typography, and page structure while still receiving normalized docs data from Squidoc.
