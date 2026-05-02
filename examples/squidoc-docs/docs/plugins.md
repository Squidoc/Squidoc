---
title: Plugins
description: Understand Squidoc plugins, install them, configure them, and choose the built-in plugins for your site.
---

# Plugins

Plugins add behavior to a Squidoc site without making authors change how they write docs. A plugin can add generated files, head tags, page metadata, extra document extensions, or UI slots that a theme renders.

Install a plugin with the CLI:

```bash
npx squidoc add plugin @squidoc/plugin-search
```

You can also install the package yourself and edit `docs.config.ts`:

```bash
npm install @squidoc/plugin-search
```

```ts
export default defineConfig({
  plugins: [
    "@squidoc/plugin-seo",
    "@squidoc/plugin-pages",
    "@squidoc/plugin-codeblocks",
    "@squidoc/plugin-article-tree",
    "@squidoc/plugin-search",
  ],
});
```

Use object form when a plugin exposes options:

```ts
plugins: [
  {
    name: "@acme/squidoc-plugin-example",
    options: {
      message: "Hello from plugin options.",
    },
  },
];
```

Plugin order matters when plugins build on each other. Keep format plugins such as `@squidoc/plugin-mdx` near the rest of your document pipeline, and keep UI plugins enabled only when your theme renders their slots.

## Built-in plugins

The starter includes `@squidoc/plugin-seo`, `@squidoc/plugin-pages`, `@squidoc/plugin-codeblocks`, and `@squidoc/plugin-article-tree`. The dogfood docs also enable search, versioning, i18n, MDX discovery, and AI-readable docs output.

## Plugin reference

### `@squidoc/plugin-seo`

Adds metadata and generated files for search engines and social previews.

Options: none.

Adds:

- favicon and web manifest tags
- Open Graph title, description, and URL tags
- Twitter card metadata
- canonical links when `site.url` is set
- localized `hreflang` alternates when `@squidoc/plugin-i18n` is enabled
- `robots.txt`
- `sitemap.xml` when `site.url` is set

```ts
plugins: ["@squidoc/plugin-seo"];
```

### `@squidoc/plugin-codeblocks`

Adds syntax highlighting and copy buttons for fenced Markdown code blocks.

Options:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `theme` | `string` | `"github-light"` | Shiki theme name used for highlighted code. |

```ts
plugins: [
  {
    name: "@squidoc/plugin-codeblocks",
    options: {
      theme: "github-light",
    },
  },
];
```

This plugin transforms Markdown code blocks after rendering. If a code fence has no language, Squidoc highlights it as plain text.

### `@squidoc/plugin-pages`

Adds Astro page support for non-doc routes such as homepages, changelogs, landing pages, and product pages. See the [Pages guide](/pages).

Options:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `pagesDir` | `string` | `"pages"` | Directory, relative to your project root, where Squidoc discovers `.astro` pages. |

```ts
plugins: [
  {
    name: "@squidoc/plugin-pages",
    options: {
      pagesDir: "pages",
    },
  },
];
```

Page files can export `squidoc` metadata:

```astro
---
export const squidoc = {
  title: "Changelog",
  description: "Product updates and release notes.",
  layout: "page",
};
---
```

Supported layouts are `page` and `docs`. Dynamic Astro routes such as `[slug].astro` are not supported.

### `@squidoc/plugin-article-tree`

Adds the “On this page” heading tree. The basic theme renders it on desktop for pages with `h2` or `h3` headings.

Options: none.

Adds:

- `article-tree` theme slot
- client-side active-heading tracking while readers scroll

```ts
plugins: ["@squidoc/plugin-article-tree"];
```

### `@squidoc/plugin-search`

Adds a static search index and search UI. The basic theme renders search in the desktop navbar and inside the mobile menu.

Options: none.

Adds:

- `search-index.json`
- `search` theme slot
- version-aware result labels when `@squidoc/plugin-versions` is enabled
- locale-scoped results when `@squidoc/plugin-i18n` is enabled

```ts
plugins: ["@squidoc/plugin-search"];
```

Search indexes page titles, descriptions, routes, and normalized Markdown content. It removes code fences from indexed content so large examples do not dominate results.

### `@squidoc/plugin-mdx`

Adds `.mdx` file discovery.

Options: none.

```ts
plugins: ["@squidoc/plugin-mdx"];
```

This plugin does not compile JSX components yet. Today it only lets Squidoc discover `.mdx` files alongside `.md` files. See the [MDX guide](/mdx) for the current limits.

### `@squidoc/plugin-llms`

Generates AI-readable docs files.

Options: none.

Adds:

- `llms.txt`
- `llms-full.txt`

```ts
plugins: ["@squidoc/plugin-llms"];
```

If `site.url` is set, generated links use absolute URLs. Otherwise, generated links use site routes.

### `@squidoc/plugin-versions`

Adds versioned docs routes, version metadata, a version selector, and a version manifest. See the [Versioning guide](/versioning).

Options:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `current` | `VersionConfig` | `{ name: "current", label: "Current" }` | Current docs version. |
| `versions` | `VersionConfig[]` | `[]` | Archived versions to publish. |

`VersionConfig` fields:

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | Required | Stable version id, such as `"1.0"` or `"0.9"`. |
| `label` | `string` | `name` | Label shown in the version selector. |
| `routePrefix` | `string` | Current: `/`; archived: `/versions/{name}` | Public route prefix, joined under `docs.basePath`. |
| `docsPrefix` | `string` | Archived: `versions/{name}` | Source docs directory prefix for archived docs. |

```ts
plugins: [
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
          docsPrefix: "versions/0.9",
          routePrefix: "/versions/0.9",
        },
      ],
    },
  },
];
```

Adds:

- `versions.json`
- `version-selector` theme slot
- version metadata in page frontmatter for other plugins

When a page exists in one version but not another, the selector falls back to that version’s root instead of sending readers to a missing page.

### `@squidoc/plugin-i18n`

Adds localized docs routes, locale metadata, a language selector, and locale manifests. See the [Internationalization guide](/i18n).

Options:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultLocale` | `string` | `"en"` | Locale used for unprefixed routes. |
| `locales` | `{ code: string; label?: string }[]` | `[{ code: defaultLocale, label: "English" }]` | Locales to publish. |

```ts
plugins: [
  {
    name: "@squidoc/plugin-i18n",
    options: {
      defaultLocale: "en",
      locales: [
        { code: "en", label: "English" },
        { code: "es", label: "Español" },
      ],
    },
  },
];
```

Locale codes must use BCP 47-style formatting such as `en`, `es`, or `pt-BR`. Codes like `en_US` are rejected.

Adds:

- `locales.json`
- `locale-selector` theme slot
- locale metadata in page frontmatter for other plugins
- localized nav filtering so links only appear when the target page exists in that locale

If you use i18n with versioning, list `@squidoc/plugin-versions` before `@squidoc/plugin-i18n`.

## Removing a plugin

Remove the package from `plugins` in `docs.config.ts`, then remove the dependency from your package manager if you no longer need it.

```ts
plugins: [
  "@squidoc/plugin-seo",
  "@squidoc/plugin-pages",
  "@squidoc/plugin-codeblocks",
  "@squidoc/plugin-article-tree",
];
```

Run `npm run check` after changing plugins. If a plugin added routes, document formats, generated files, or theme slots, this catches the most common config mistakes before deployment.
