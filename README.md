# Squidoc

Squidoc is an open-source, static-first documentation platform inspired by tools like Docusaurus, but built around a modular plugin system, powerful themes, and strong SEO defaults.

The goal workflow:

```bash
npm create squidoc@latest my-docs
cd my-docs
npm run dev
```

Then users add docs, configure `docs.config.ts`, install plugins/themes, and deploy the generated static site to platforms like Vercel, Netlify, or Cloudflare Pages.

## Monorepo

```txt
packages/
  create-squidoc/   Project generator for npm create squidoc@latest
  squidoc/          Main CLI: dev, build, preview, add, check, doctor
  core/              Config, plugin API, theme API, docs model
  theme-basic/       Default theme
  plugin-seo/        Default SEO plugin
  plugin-mdx/        Optional MDX support
  plugin-search/     Optional search support
  plugin-llms/       llms.txt and llms-full.txt support
```

## Development

```bash
pnpm install
pnpm build
pnpm check
pnpm test
```

## Publishing

This repo uses Changesets for multi-package versioning and publishing.

```bash
pnpm changeset
pnpm version-packages
pnpm publish-packages
```

