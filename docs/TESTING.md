# Testing And Iteration Loop

Squidoc should be dogfooded from the beginning. Every meaningful implementation slice should prove three things before it is committed:

1. The packages still compile and type-check.
2. Unit tests pass.
3. The dogfood docs site can be checked and built through the public CLI.

## Local Verification

Run the full loop:

```bash
pnpm lint
pnpm build
pnpm check
pnpm test
```

`pnpm test` also runs:

```bash
pnpm check:docs
pnpm build:docs
pnpm test:dogfood
pnpm test:generator
```

That means the example docs site in `examples/squidoc-docs` must keep working as the renderer, config system, plugins, and themes evolve.

`pnpm test:dogfood` inspects the generated static site and verifies core dogfood outputs such as page titles, canonical tags, the search slot, `search-index.json`, `llms.txt`, and `llms-full.txt`.

## Dogfood Site

The dogfood site lives at:

```txt
examples/squidoc-docs/
```

It should become the public documentation site for Squidoc. When a feature is added, prefer demonstrating it there instead of only testing it with synthetic fixtures.

## Commit Standard

Use conventional commits for every commit:

```txt
feat(core): load config and discover docs
fix(cli): handle missing docs directory
docs: document the testing loop
chore(ci): run dogfood build in checks
```

Keep commits small enough that each one has a clear reason to exist.
