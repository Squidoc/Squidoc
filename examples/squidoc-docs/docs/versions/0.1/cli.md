---
title: CLI Reference
description: Understand squidoc dev, build, preview, check, doctor, and add.
---

# CLI Reference

The generated project exposes Squidoc through package scripts, but each script maps to a CLI command.

```json
{
  "scripts": {
    "dev": "squidoc dev",
    "build": "squidoc build",
    "preview": "squidoc preview",
    "check": "squidoc check",
    "doctor": "squidoc doctor"
  }
}
```

## `squidoc dev`

Starts the local development server. It watches docs, config, plugins, and theme inputs, regenerates the internal Astro project, and keeps the server running while you edit.

Use it during normal writing:

```bash
npm run dev
```

## `squidoc build`

Builds the production site and writes static output to `dist/`.

```bash
npm run build
```

Run this in CI and before deployment.

## `squidoc preview`

Serves the built `dist/` output locally.

```bash
npm run preview
```

Use preview after `npm run build` when you want to test the production output instead of the development server.

## `squidoc check`

Validates the docs project without building the site.

```bash
npm run check
```

`check` currently catches:

- A docs directory with no discovered pages.
- Navigation items that point to missing docs routes.
- Internal Markdown links that point to missing docs routes.

It ignores external links, protocol-relative links, pure hash links, email links, and telephone links.

## `squidoc doctor`

Prints a project health report:

```bash
npm run doctor
```

`doctor` reports:

- The resolved config path.
- The configured docs directory.
- The number of discovered pages.
- The detected package manager based on lockfiles.
- The active theme.
- The configured plugins.
- The same validation issues reported by `squidoc check`.

Use `doctor` when something feels off and you want a quick snapshot of what Squidoc thinks your project contains.

## `squidoc add`

Installs a plugin or theme and updates `docs.config.ts`.

```bash
npx squidoc add plugin @squidoc/plugin-search
npx squidoc add theme @squidoc/theme-basic
```

The generator prints the package manager command that matches the environment it was run from. In an existing project, use the package manager your repo already uses.
