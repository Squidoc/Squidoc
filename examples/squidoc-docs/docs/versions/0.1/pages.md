---
title: Pages
description: Build custom Astro pages for homepages, changelogs, landing pages, and other non-doc routes.
---

# Pages

`@squidoc/plugin-pages` lets a Squidoc site publish custom Astro pages outside the documentation tree. Use it for homepages, changelogs, landing pages, about pages, release pages, and anything else that should not live in the docs sidebar.

Docs still come from `docs/` and publish under `docs.basePath`, which defaults to `/docs`. Pages come from `pages/` and publish from the site root.

```txt
docs/
  index.md
  configuration.md
pages/
  index.astro
  changelog.astro
```

That produces:

```txt
/docs/
/docs/configuration/
/
/changelog/
```

## Install

The starter project includes the pages plugin by default. To add it manually:

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

If the pages plugin is not installed, or if it is installed but no `pages/index.astro` exists, Squidoc generates a root page that redirects `/` to your docs index.

## Create a Page

Create `pages/index.astro`:

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

Pages are Astro components wrapped by the active Squidoc theme. You can write HTML, CSS classes, Astro expressions, and local component imports that Astro can compile statically.

## Layouts

Squidoc currently supports exactly two page layouts:

- `page`: the default layout for custom pages. It includes the site navbar and footer, but no docs sidebar or article tree.
- `docs`: the documentation layout. It includes the docs sidebar, version selector, article tree slot, and docs content styling.

If `layout` is omitted, Squidoc uses `page`.

```astro
---
export const squidoc = {
  title: "Changelog",
  layout: "docs",
};
---

<h1>Changelog</h1>
```

Use `docs` only when the page should behave like part of the documentation experience. Most homepages, changelogs, and landing pages should use the default `page` layout.

## Limits

Pages are static Astro pages. They are not API routes, SSR endpoints, or server-only pages. Route conflicts are not allowed: a page cannot publish to the same route as a documentation page.

For example, with the default docs base path, `pages/docs.astro` conflicts with the docs index at `/docs` and `squidoc build` fails with a clear route collision error.
