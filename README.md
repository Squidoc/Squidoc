# Squidoc

Squidoc is an open-source, static-first documentation platform inspired by tools like Docusaurus, but built around a modular plugin system, powerful themes, and strong SEO defaults.

The goal workflow:

```bash
npm create squidoc@latest my-docs
cd my-docs
npm run dev
```

Then users add docs, configure `docs.config.ts`, install plugins/themes, and deploy the generated static site to platforms like Vercel, Netlify, or Cloudflare Pages.

New projects include SEO metadata, syntax highlighting, and an article tree by default. Users can remove those plugins from `docs.config.ts` if they want a leaner site.

Plugins and themes can be added through the Squidoc CLI:

```bash
npx squidoc add plugin @squidoc/plugin-search
npx squidoc add theme @squidoc/theme-basic
```

The add command installs the package with the detected package manager and updates `docs.config.ts`.

## Monorepo

```txt
packages/
  create-squidoc/   Project generator for npm create squidoc@latest
  squidoc/          Main CLI: dev, build, preview, add, check, doctor
  core/              Config, plugin API, theme API, docs model
  theme-basic/       Default responsive theme
  plugin-seo/        Default SEO plugin
  plugin-syntax-highlight/
                     Default syntax highlighting plugin
  plugin-article-tree/
                     Default article tree plugin
  plugin-mdx/        Optional MDX support
  plugin-search/     Optional search support
  plugin-llms/       llms.txt and llms-full.txt support
```

## Development

```bash
pnpm install
pnpm lint
pnpm build
pnpm check
pnpm test
```

The dogfood docs site lives in `examples/squidoc-docs` and is included in the test loop.

## Phase 1

Phase 1 establishes the static-first core:

- Project generator and public CLI.
- Markdown docs rendering with optional MDX.
- Config validation and nested navigation.
- Plugin system with SEO, search, syntax highlighting, article tree, MDX, and llms output.
- Basic responsive theme with navbar, mobile sidebar, footer options, code highlighting, search, and article tree slots.
- Dogfood docs site, generated-site smoke tests, browser smoke tests, generator smoke tests, CI, and Changesets publishing flow.

## Publishing

This repo uses Changesets for multi-package versioning and publishing.

```bash
pnpm changeset
pnpm version-packages
pnpm publish-packages
```
