---
title: Introduction
description: Learn what Squidoc is, how it works, and where to start.
---

# Squidoc

Squidoc is a static-first documentation platform with a plugin system, powerful themes, and SEO-first defaults.

It is built for teams that want the first five minutes to feel simple: create a project, write Markdown, run a local server, and deploy a fast static site. Under that simple workflow, Squidoc keeps the platform modular so power users can add search, MDX, LLM files, custom SEO behavior, and full site themes without replacing the docs pipeline.

## The mental model

A Squidoc project has four moving parts:

- `docs/` contains the articles that publish under `/docs` by default.
- `pages/` contains optional Astro pages for custom routes such as `/` or `/changelog`.
- `docs.config.ts` defines site metadata, navigation, plugins, and the active theme.
- Plugins add behavior such as SEO tags, generated files, custom pages, search indexes, code block enhancements, article trees, and additional document formats.
- Themes decide how docs and custom pages become navigation, headers, footers, and layouts.

Squidoc generates an internal Astro project during development and build. You do not need to author Astro pages to use Squidoc; Astro is the static rendering engine that gives the generated site fast builds, static output, and easy deployment.

## Start here

Begin with [Getting Started](/getting-started), then read [Configuration](/configuration), [Frontmatter](/frontmatter), [Pages](/pages), and the [CLI Reference](/cli). When you are ready to publish, use the [Deployment](/deployment) guide.
