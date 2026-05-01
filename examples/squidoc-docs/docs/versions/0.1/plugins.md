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

`@squidoc/plugin-seo` ships in the default config. It adds SEO metadata, canonical URLs, robots output, and sitemap output based on your site config and discovered pages.

`@squidoc/plugin-codeblocks` ships in the default config. It adds syntax highlighting, code block styling hooks, and copy buttons for code examples.

`@squidoc/plugin-pages` ships in the default config. It adds Astro page support for homepages, changelogs, landing pages, and other non-doc routes. See the [Pages guide](/pages).

`@squidoc/plugin-article-tree` ships in the default config. It adds the on-page heading tree that tracks `h2` and `h3` sections as readers scroll.

`@squidoc/plugin-search` adds `search-index.json` and a search UI slot. The basic theme renders that slot in the navbar on desktop and inside the mobile menu on small screens. When versioning is enabled, search results are scoped to the active version and labeled with the version they belong to.

`@squidoc/plugin-mdx` adds `.mdx` file discovery. It does not compile JSX components yet; see the [MDX guide](/mdx) for the current limits.

`@squidoc/plugin-llms` generates `llms.txt` and `llms-full.txt` so AI tools can discover and read your documentation in a predictable format.

`@squidoc/plugin-versions` adds version metadata, a version selector slot, `versions.json`, and route handling for archived docs. See the [Versioning guide](/versioning).

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
