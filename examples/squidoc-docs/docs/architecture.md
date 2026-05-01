---
title: Architecture
description: How Squidoc is structured internally.
---

# Architecture

Squidoc uses a monorepo because the platform ships multiple npm packages together.

The core package owns config loading, docs discovery, plugin definitions, and theme definitions. The CLI package owns user commands such as `squidoc check` and `squidoc build`.

During local development, Squidoc watches documentation files and regenerates the internal Astro project without requiring a server restart.

The internal Astro project is generated from real template files that ship with the CLI. Squidoc writes structured render data into `src/squidoc-data.mjs`, then a catch-all Astro route renders every page from `src/pages/[...route].astro`. This keeps the page shell editable as normal Astro instead of hiding load-bearing markup inside TypeScript string literals.
