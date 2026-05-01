# Contributing

Thanks for helping build Squidoc. This repo is a pnpm monorepo containing the public CLI, project generator, core APIs, default theme, plugins, dogfood docs, and release tooling.

## Monorepo Layout

```txt
packages/
  create-squidoc/   Project generator for npm create squidoc@latest
  squidoc/          Main CLI: dev, build, preview, add, check, doctor
  core/             Config, plugin API, theme API, docs model
  theme-basic/      Default responsive theme
  plugin-seo/       Default SEO plugin
  plugin-codeblocks/
                    Default code blocks plugin
  plugin-article-tree/
                    Default article tree plugin
  plugin-mdx/       Optional MDX support
  plugin-search/    Optional search support
  plugin-llms/      llms.txt and llms-full.txt support
examples/
  squidoc-docs/     Dogfood docs site
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

## Testing

`pnpm test` runs package tests, checks the dogfood docs, builds the dogfood docs, verifies generated output, runs browser smoke tests, and runs the project generator smoke test.

Before publishing, also run an npm package dry run:

```bash
pnpm -r --filter './packages/**' exec npm pack --dry-run --cache /private/tmp/squidoc-npm-cache
```

This verifies package `files` fields and catches missing templates or accidental test fixture/source leakage before release.

## Phase 1

Phase 1 establishes the static-first core:

- Project generator and public CLI.
- Markdown docs rendering with optional MDX.
- Config validation and nested navigation.
- Plugin system with SEO, search, code blocks, article tree, MDX, and llms output.
- Basic responsive theme with navbar, mobile sidebar, footer options, code highlighting, search, and article tree slots.
- Dogfood docs site, generated-site smoke tests, browser smoke tests, generator smoke tests, CI, and Changesets publishing flow.

## Publishing

This repo uses Changesets for multi-package versioning and publishing.

```bash
pnpm changeset
pnpm version-packages
pnpm publish-packages
```

Tagged releases run through GitHub Actions and publish with npm provenance enabled, so npm can link each package back to the workflow run and commit that produced it.
