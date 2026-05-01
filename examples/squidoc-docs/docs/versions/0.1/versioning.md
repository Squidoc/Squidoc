---
title: Versioning
description: Add versioned documentation with @squidoc/plugin-versions.
---

# Versioning

Use `@squidoc/plugin-versions` when your documentation needs to describe multiple released versions of the same project. This is useful when a new major version changes APIs, config fields, package names, or extension points and users still need accurate docs for older releases.

Install the plugin:

```bash
npx squidoc add plugin @squidoc/plugin-versions
```

Then configure the current version and any archived versions:

```ts
export default defineConfig({
  plugins: [
    "@squidoc/plugin-seo",
    "@squidoc/plugin-codeblocks",
    "@squidoc/plugin-article-tree",
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
          },
        ],
      },
    },
  ],
});
```

## File layout

Keep the current docs in the normal `docs/` tree:

```txt
docs/
  index.md
  configuration.md
  plugin-authoring.md
```

Put archived docs under `docs/versions/<name>/`:

```txt
docs/
  versions/
    0.9/
      index.md
      configuration.md
      plugin-authoring.md
```

By default, `docs/versions/0.9/configuration.md` is published under your docs base path at `/docs/versions/0.9/configuration`.

## Custom prefixes

Use `docsPrefix` when your archived docs live somewhere else, and `routePrefix` when you want a different public URL.

```ts
{
  name: "@squidoc/plugin-versions",
  options: {
    current: { name: "2.0", label: "2.0" },
    versions: [
      {
        name: "1.0",
        label: "1.0",
        docsPrefix: "archive/v1",
        routePrefix: "/v1",
      },
    ],
  },
}
```

With that config, `docs/archive/v1/api.md` becomes `/docs/v1/api` when `docs.basePath` is `/docs`.

## What the plugin adds

The plugin adds `versions.json` to the generated static output:

```json
[
  {
    "name": "1.0",
    "label": "1.0",
    "routePrefix": "/docs",
    "current": true,
    "routes": ["/docs", "/docs/configuration"]
  },
  {
    "name": "0.9",
    "label": "0.9",
    "routePrefix": "/docs/versions/0.9",
    "current": false,
    "routes": ["/docs/versions/0.9", "/docs/versions/0.9/configuration"]
  }
]
```

It also adds a `version-selector` theme slot. The basic theme renders that slot above the sidebar navigation when more than one version is configured.

Each page gets version metadata in its frontmatter data:

```ts
{
  squidocVersion: "0.9",
  squidocVersionLabel: "0.9",
  squidocVersionRoutePrefix: "/docs/versions/0.9",
  squidocVersionCurrent: false,
}
```

Themes and plugins can use that metadata to customize labels, badges, search behavior, or page chrome.

## Missing Pages

Version switching tries to keep readers on the equivalent page in the target version. If that page does not exist, the selector sends them to the target version root instead of a 404.

For example, switching from `/docs/new-feature` to `0.9` goes to `/docs/versions/0.9` when `docs/versions/0.9/new-feature.md` does not exist.

## Search Behavior

When `@squidoc/plugin-search` and `@squidoc/plugin-versions` are both enabled, search entries include version metadata. The search UI scopes results to the active version and shows the version label beside each result title.

On `/docs/configuration`, search returns current-version results. On `/docs/versions/0.9/configuration`, search returns `0.9` results. This keeps readers from accidentally jumping between documentation versions while searching.

## Planning for languages

Versioning is implemented as a project transform instead of a hardcoded docs feature. That matters because future plugins, including multilingual documentation, can use the same kind of transform to add route segments and metadata without fighting the versioning plugin.

When you combine versioning with future language support, prefer a consistent route order under the docs base path and keep it stable. For example, a site might choose `/docs/fr/versions/1.0/...` or `/docs/versions/1.0/fr/...`; changing that later will break links.
