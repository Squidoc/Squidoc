---
title: Getting Started
description: Create a Squidoc project, run it locally, and build static docs.
---

# Getting Started

Create a new docs project with the generator:

```bash
npm create squidoc@latest my-docs
cd my-docs
npm run dev
```

The generated project includes:

- `docs.config.ts` for site metadata, navigation, plugins, and theme selection.
- `docs/` for Markdown articles.
- `package.json` scripts for local development, validation, builds, and previews.
- The basic theme and default plugins for SEO, code blocks, and the article tree.

## Add your first page

Create a Markdown file in `docs/`:

```md
---
title: API Guide
description: Learn how to use the API.
---

# API Guide

Write your documentation here.
```

Then add it to `docs.config.ts`:

```ts
nav: [
  { title: "Getting Started", path: "/getting-started" },
  { title: "API Guide", path: "/api-guide" },
];
```

Squidoc routes are based on file paths. `docs/api-guide.md` becomes `/api-guide`, and `docs/index.md` becomes `/`.

## Validate before shipping

Use the CLI while you work:

```bash
npm run check
npm run build
npm run preview
```

`npm run check` catches broken navigation and internal Markdown links. `npm run build` writes the production site to `dist/`. `npm run preview` serves that production output locally so you can test the built site before deploying it.

`squidoc dev` watches docs and config files, then regenerates the internal Astro project without requiring a manual server restart.

Next, learn how to configure [frontmatter](/frontmatter), [plugins](/plugins), [themes](/themes), and [deployment](/deployment).
