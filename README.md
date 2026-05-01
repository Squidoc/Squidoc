# Squidoc

Squidoc is a static-first documentation platform for teams that want a Docusaurus-style workflow with simpler setup, first-class plugins, flexible themes, and SEO-friendly output from day one.

## Create A Docs Site

```bash
npm create squidoc@latest my-docs
cd my-docs
npm run dev
```

The starter gives you:

- Markdown docs in `docs/`
- A typed `docs.config.ts`
- A responsive default theme
- SEO, code blocks, and article tree plugins enabled by default
- Static builds that deploy cleanly to Vercel, Netlify, Cloudflare Pages, or any static host

## Generated Output

```txt
my-docs/
  docs/
    index.md
    getting-started.md
  public/
  docs.config.ts
  package.json
  .gitignore
```

```ts
import { defineConfig } from "squidoc";

export default defineConfig({
  site: {
    name: "My Docs",
    description: "Documentation powered by Squidoc",
  },
});
```

## Documentation

The docs site will be published at [squidoc.dev](https://squidoc.dev). Until then, the dogfood docs live in `examples/squidoc-docs`.

## Contributing

Want to hack on Squidoc itself? See [CONTRIBUTING.md](./CONTRIBUTING.md).
