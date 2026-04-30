---
title: Getting Started
description: Create a Squidoc project, run it locally, and build static docs.
---

# Getting Started

Create a new docs project with the generator:

```bash
npm create squidoc@latest my-docs
cd my-docs
npm run dev
```

The generated project includes a `docs.config.ts` file, a `docs` directory, the basic theme, and the SEO plugin.

Use the public CLI while you work:

```bash
npm run check
npm run build
npm run preview
```

`squidoc dev` watches docs and config files, then regenerates the internal Astro project without requiring a manual server restart.

When the site is ready, deploy the generated static output to Vercel, Netlify, Cloudflare Pages, or any host that can serve a `dist` directory.
