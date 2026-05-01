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
    docs: "./layouts/Docs.astro",
    page: "./layouts/Page.astro",
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

## Layout Contract

Every theme should support Squidoc's stable layout contract. For now there are exactly two layouts:

- `docs`: documentation pages with the docs sidebar, locale selector, version selector, article tree slot, and article content styling.
- `page`: custom pages from `@squidoc/plugin-pages`, such as homepages, changelogs, landing pages, and about pages.

Page authors can choose a layout from their Astro page metadata:

```astro
---
export const squidoc = {
  title: "Changelog",
  layout: "docs",
};
---
```

If a page omits `layout`, Squidoc uses `page`. Theme authors should treat both layouts as first-class surfaces. Future Squidoc releases may add more layouts, such as `blog`, but themes should not invent extra public layout names today because that would make theme compatibility harder to keep stable.

Themes can also receive plugin slots. The basic theme renders:

- `search` in the navbar.
- `locale-selector` in the docs sidebar.
- `version-selector` in the docs sidebar.
- `article-tree` beside the docs article.

Slots let plugins add UI without being hardcoded into the core renderer. Theme authors can move these slots, but should keep them available in the `docs` layout so search, i18n, versioning, and article navigation work when those plugins are installed.

Powerful themes are a core design goal. Themes should be able to change navigation placement, headers, footers, widgets, typography, and page structure while still receiving normalized docs data from Squidoc.
