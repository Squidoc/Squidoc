---
title: Architecture
description: How Squidoc is structured internally.
---

# Architecture

Squidoc uses a monorepo because the platform ships multiple npm packages together.

The core package owns config loading, docs discovery, plugin definitions, and theme definitions. The CLI package owns user commands such as `squidoc check` and `squidoc build`.
