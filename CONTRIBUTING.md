# Contributing

Thanks for helping build Squidoc. This repo is a pnpm monorepo containing the public CLI, project generator, core APIs, default theme, plugins, dogfood docs, and release tooling.

## Local Setup

Prerequisites:

- Node.js 20 or newer
- pnpm 10.30.2 or newer

Clone the repo and install dependencies:

```bash
git clone https://github.com/Squidoc/Squidoc.git
cd Squidoc
pnpm install
```

Build the packages:

```bash
pnpm build
```

Run the dogfood docs locally:

```bash
pnpm --filter @squidoc/docs dev
```

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

## Running Tests

Before opening a pull request, run:

```bash
pnpm lint
pnpm build
pnpm check
pnpm test
```

`pnpm test` runs package tests, checks the dogfood docs, builds the dogfood docs, verifies generated output, runs browser smoke tests, and runs the project generator smoke test.

For package publish checks, run:

```bash
pnpm -r --filter './packages/**' exec npm pack --dry-run --cache /private/tmp/squidoc-npm-cache
```

This verifies package `files` fields and catches missing templates or accidental test fixture/source leakage before release.

## Submitting A Pull Request

1. Create a branch from `main`.
2. Keep the change focused and include tests or docs when useful.
3. Run the checks above.
4. Use conventional commit messages, such as `fix(create): derive package name from target`.
5. Open a pull request with a short summary, testing notes, and screenshots for UI changes.

If your change affects published package behavior, add a Changeset:

```bash
pnpm changeset
```

## Publishing

This repo uses Changesets for multi-package versioning and publishing.

```bash
pnpm changeset
pnpm version-packages
pnpm publish-packages
```

Tagged releases run through GitHub Actions and publish with npm provenance enabled, so npm can link each package back to the workflow run and commit that produced it.
