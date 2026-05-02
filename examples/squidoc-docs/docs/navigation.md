---
title: Sidebar Navigation
description: Configure manual, automatic, and mixed sidebar navigation in Squidoc.
---

# Sidebar Navigation

Squidoc supports manual sidebars, generated sidebars, and mixed sidebars. Manual navigation is best when you want exact control. Generated navigation is best when your docs tree already matches the way readers should browse.

## Manual navigation

Manual navigation is the original `nav` array format. Paths are docs-relative, so `/configuration` points at `docs/configuration.md` and publishes under your configured `docs.basePath`.

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

Folders can also be articles. When an item has both `path` and `items`, clicking the folder opens the article and the sidebar can still expand its children.

## Fully automatic navigation

Use `"auto"` when you want Squidoc to build the sidebar from every discovered document.

```ts
export default defineConfig({
  nav: "auto",
});
```

Given this tree:

```txt
docs/
  index.md
  getting-started.md
  developers/
    index.md
    plugin-authoring.md
    theme-authoring.md
```

Squidoc generates:

- Introduction
- Getting Started
- Developers
  - Plugin Authoring
  - Theme Authoring

If a folder has an `index.md` or `index.mdx`, the folder becomes a clickable article. If it does not, the folder only expands and collapses.

## Automatic sections

Use object form when you want to generate navigation from one docs folder.

```ts
export default defineConfig({
  nav: {
    autogenerate: {
      from: "/developers",
    },
  },
});
```

`from` is docs-relative. `from: "/developers"` reads documents below `docs/developers`.

## Mixed navigation

Generated sections can be placed inside a manual sidebar.

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

When the generated section has an index page, Squidoc uses it as the folder link. In the example above, `docs/developers/index.md` becomes the clickable `Developers` article.

You can also append manual children to generated children:

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

## Excluding source folders

Use `exclude` when a directory exists for a plugin or build convention but should not appear in the generated sidebar.

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

`exclude` patterns are docs-relative. Supported forms are exact routes, one-level wildcards, and recursive folder wildcards:

| Pattern | Matches |
| --- | --- |
| `drafts` | `docs/drafts.md` |
| `drafts/*` | direct children of `docs/drafts/` |
| `drafts/**` | every document below `docs/drafts/` |

## Sorting and labels

Automatic navigation uses this order:

1. `nav.order` frontmatter
2. folder index pages before child pages
3. page title alphabetically

Use frontmatter when the file tree needs a different label or order:

```md
---
title: Plugin Authoring
nav:
  title: Plugins
  order: 20
---
```

Numeric prefixes are stripped from generated labels, so a file titled `01 Getting Started` appears as `Getting Started`.

## Hiding pages

Use `nav.hidden` to keep a page out of generated navigation while still publishing it.

```md
---
title: Internal Migration Notes
nav:
  hidden: true
---
```

Hidden pages are still rendered, indexed by plugins that read pages, and reachable by direct URL unless another plugin changes that behavior.
