# Phase 1 Status

Phase 1 is the static-first foundation for Squidoc. It should be usable for dogfooding the Squidoc docs and solid enough for early open-source feedback.

## Complete

- Monorepo with publishable npm packages.
- `create-squidoc` project generator.
- `squidoc` CLI with `dev`, `build`, `preview`, `check`, `doctor`, and `add`.
- Markdown docs discovery and rendering.
- Optional MDX support through `@squidoc/plugin-mdx`.
- Config validation through `docs.config.ts`.
- Nested sidebar navigation with folder pages.
- Default responsive theme with navbar, footer options, mobile sidebar, search slot, and article tree slot.
- Default plugins for SEO, code blocks, and article tree.
- Optional plugins for search, MDX, and `llms.txt` / `llms-full.txt`.
- Dogfood docs site in `examples/squidoc-docs`.
- CI, Changesets release workflow, package metadata, and npm dry-run coverage.
- Unit tests, generated-site smoke tests, browser smoke tests, and generator smoke tests.

## Phase 1 Exit Checks

Before cutting the first public release candidate:

```bash
pnpm lint
pnpm build
pnpm check
pnpm test
pnpm -r --filter './packages/**' exec npm pack --dry-run --cache /private/tmp/squidoc-npm-cache
```

## Next Phase Candidates

- Component-based theme slots.
- Richer theme data contracts.
- Dark mode plugin.
- Copy-code button plugin.
- Versioned docs.
- Redirects and route aliases.
- Structured data expansion in the SEO plugin.
