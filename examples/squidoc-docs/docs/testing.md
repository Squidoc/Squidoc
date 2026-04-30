---
title: Testing
description: Verify packages, generated docs, plugins, and the dogfood site.
---

# Testing

Squidoc uses the dogfood docs site as part of the normal test loop.

Run the full local verification pass:

```bash
pnpm lint
pnpm build
pnpm check
pnpm test
```

`pnpm test` runs package tests, checks the dogfood docs, builds the dogfood docs, verifies generated output, and runs the project generator smoke test.

The generated-site smoke test checks for page titles, canonical tags, the visible search slot, `search-index.json`, `llms.txt`, and `llms-full.txt`.

When adding a user-facing feature, prefer demonstrating it in this site and checking it in the browser before committing.
