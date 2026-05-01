---
title: Deployment
description: Deploy a Squidoc site to production on Vercel, Netlify, Cloudflare Pages, GitHub Pages, Docker, and static hosts.
---

# Deployment

Squidoc builds a static site. Production deployment usually means running `npm run build` and serving the generated `dist/` directory from any static host.

Before deploying, run the same checks locally that your host should run in CI:

```bash
npm run check
npm run build
npm run preview
```

`npm run check` validates your docs project, `npm run build` writes `dist/`, and `npm run preview` serves the built output locally.

## Vercel

Create a new Vercel project from your repository and use these settings:

- Framework preset: `Other`
- Build command: `npm run build`
- Output directory: `dist`
- Install command: the package manager command for your project, such as `npm install`, `pnpm install`, `yarn install`, or `bun install`

If your Squidoc site lives inside a monorepo, set the Vercel root directory to the folder that contains its `package.json` and `docs.config.ts`.

## Netlify

Create a new Netlify site from your repository and use:

- Build command: `npm run build`
- Publish directory: `dist`

You can also commit a `netlify.toml` file:

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

## Cloudflare Pages

Create a Cloudflare Pages project from your repository and use:

- Framework preset: `None`
- Build command: `npm run build`
- Build output directory: `dist`

Cloudflare Pages works well for Squidoc because the final output is static HTML, CSS, JavaScript, and generated assets.

## GitHub Pages

GitHub Pages can deploy the `dist/` directory with GitHub Actions.

```yaml
name: Deploy Docs

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run check
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

If you deploy to a repository subpath, set `site.url` to the final public URL in `docs.config.ts` so canonical URLs and generated SEO files point to the right place.

## Docker

Use Docker when you want to ship the static site as a container. This example builds with Node and serves the generated output with Nginx:

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

For pnpm, yarn, or bun projects, replace the install step with your package manager's lockfile and install command.

## Generic static hosting

Any host that can serve static files can host Squidoc. Run:

```bash
npm run build
```

Then upload the contents of `dist/` to your host. Keep `docs.config.ts` `site.url` aligned with the production domain so canonical links, sitemap entries, and LLM files use the right URLs.
