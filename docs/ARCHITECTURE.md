# Squidoc Architecture Proposal

## Product Direction

Squidoc is a static-first documentation platform. Users generate a project, write Markdown docs, configure the site through a typed config file, install plugins/themes, and deploy easily to static hosting platforms.

Markdown is supported by default. MDX is optional and added through a plugin.

## Recommended Foundation: Astro

Astro is the preferred rendering foundation because this product is fundamentally a content site generator, not a client application shell.

React gives us components, but not a complete docs platform. If we built directly on React, we would still need to solve static page generation, Markdown loading, frontmatter validation, routing, asset handling, SEO-friendly rendering, MDX integration, deploy behavior, and the development server experience.

Astro gives us:

- Static HTML output by default.
- Markdown-first content support.
- Optional MDX support.
- Vite-powered dev and build tooling.
- Low JavaScript output by default.
- Strong SEO characteristics.
- Component-based theme authoring.
- Interactive islands for search, charts, feedback widgets, command palettes, and other dynamic UI.
- Compatibility with React components where useful.

The proposed approach is: Astro inside, Squidoc outside.

Users should interact with our CLI, config, plugin API, and theme API. Astro should be an internal rendering engine we can use without exposing every implementation detail.

## Package Layout

```txt
packages/
  create-squidoc/
  squidoc/
  core/
  theme-basic/
  plugin-seo/
  plugin-mdx/
  plugin-search/
  plugin-llms/
examples/
  basic/
  advanced/
```

## Generated User Project

```txt
my-docs/
  docs/
    index.md
    getting-started.md
  public/
  docs.config.ts
  package.json
```

The generated scripts should be:

```json
{
  "scripts": {
    "dev": "squidoc dev",
    "build": "squidoc build",
    "preview": "squidoc preview",
    "check": "squidoc check"
  }
}
```

## Config System

Squidoc uses `docs.config.ts`.

```ts
import { defineConfig } from 'squidoc'

export default defineConfig({
  site: {
    name: 'Acme Docs',
    url: 'https://docs.acme.com',
    description: 'Documentation for Acme'
  },
  theme: {
    name: '@squidoc/theme-basic',
    options: {
      logo: '/logo.svg',
      primaryColor: '#2563eb',
      headerLinks: [{ label: 'GitHub', href: 'https://github.com/acme' }]
    }
  },
  plugins: ['@squidoc/plugin-seo', '@squidoc/plugin-search'],
  nav: [{ title: 'Getting Started', path: '/getting-started' }]
})
```

Config should be validated with Zod so user errors are clear and actionable.

## Theme System

Themes should be powerful, closer to Shopify themes than simple CSS skins. A theme can control the structure and look of the site, including layouts, navigation placement, header/footer, widgets, typography, mobile navigation, code blocks, and plugin UI slots.

Theme packages may include:

```txt
@squidoc/theme-basic/
  theme.config.ts
  layouts/
    Root.astro
    DocPage.astro
    HomePage.astro
  components/
    Header.astro
    Sidebar.astro
    Footer.astro
  styles/
    theme.css
```

Themes receive normalized site data such as `site`, `nav`, `pages`, `currentPage`, `themeOptions`, and `pluginSlots`.

## Plugin System

Plugins add platform behavior. Examples include SEO, search, MDX, dark mode, analytics, sitemap generation, redirects, versioning, OpenAPI docs, code tabs, and copy buttons.

Plugin hooks should include:

- `extendMarkdown()`
- `extendHtml()`
- `addHeadTags()`
- `addRoute()`
- `addGeneratedFile()`
- `addClientScript()`
- `addThemeSlot()`
- `validateConfig()`
- `onBuildStart()`
- `onBuildEnd()`

## SEO

SEO ships by default through `@squidoc/plugin-seo`.

The SEO plugin should handle:

- Title templates.
- Meta descriptions.
- Canonical URLs.
- Open Graph tags.
- Twitter card tags.
- `sitemap.xml`.
- `robots.txt`.
- Structured data.
- Clean static URLs.
- Heading validation.
- Broken internal link checks.
- Missing metadata warnings.
- Duplicate title warnings.

## Quality And Release System

The repo should use:

- TypeScript strict mode.
- Biome for linting and formatting.
- Vitest for unit tests.
- Playwright for generated-site smoke tests later.
- Changesets for package versioning and npm publishing.
- GitHub Actions for CI and release automation.
- Fixture projects for integration tests.

## MVP Plan

1. Monorepo scaffold.
2. CLI package with `dev`, `build`, `preview`.
3. Config loader with `docs.config.ts`.
4. Markdown docs discovery.
5. Astro-backed static rendering.
6. Basic theme.
7. Default SEO plugin.
8. Project generator.
9. Plugin/theme install commands.
10. `squidoc check`.
11. MDX plugin.
12. Search plugin.
13. `llms.txt` plugin.
