---
title: "Plugins"
description: "Dokumentation fuer Squidoc auf Deutsch."
---

# Plugins

Squidoc ist eine statische Dokumentationsplattform mit Plugins, Themes und SEO-freundlichen Voreinstellungen. Schreibe Markdown, konfiguriere dein Projekt in docs.config.ts und veroeffentliche ein schnelles statisches Docs-Site.

## Projektstruktur

Dokumente liegen in docs/, optionale Astro-Seiten in pages/, und docs.config.ts verbindet Website-Metadaten, Navigation, Plugins und Theme.

## Erweitern

Plugins fuegen Verhalten wie Suche, SEO, Codebloecke, Versionierung, Internationalisierung und generierte Dateien hinzu. Themes steuern Layout, Navigation und Slots.

## Verifizieren

Nutze npm run check, npm run build und npm run preview, bevor du deployest.

## Plugins

Diese Seite folgt der englischen Dokumentation, damit alle unterstuetzten Sprachen dieselbe Abdeckung fuer die aktuelle Version haben.

[Erste Schritte](/getting-started) · [Konfiguration](/configuration) · [Themes](/themes) · [Deployment](/deployment)

## Referenzbeispiele

```bash
npx squidoc add plugin @squidoc/plugin-search
```

```bash
npm install @squidoc/plugin-search
```

```ts
export default defineConfig({
  plugins: [
    "@squidoc/plugin-seo",
    "@squidoc/plugin-pages",
    "@squidoc/plugin-codeblocks",
    "@squidoc/plugin-article-tree",
    "@squidoc/plugin-search",
  ],
});
```

```ts
plugins: [
  {
    name: "@acme/squidoc-plugin-example",
    options: {
      message: "Hello from plugin options.",
    },
  },
];
```

```ts
plugins: ["@squidoc/plugin-seo"];
```

```ts
plugins: [
  {
    name: "@squidoc/plugin-codeblocks",
    options: {
      theme: "github-light",
    },
  },
];
```

```ts
plugins: [
  {
    name: "@squidoc/plugin-pages",
    options: {
      pagesDir: "pages",
    },
  },
];
```

```astro
---
export const squidoc = {
  title: "Changelog",
  description: "Product updates and release notes.",
  layout: "page",
};
---
```

```ts
plugins: ["@squidoc/plugin-article-tree"];
```

```ts
plugins: ["@squidoc/plugin-search"];
```

```ts
plugins: ["@squidoc/plugin-mdx"];
```

```ts
plugins: ["@squidoc/plugin-llms"];
```

```ts
plugins: [
  {
    name: "@squidoc/plugin-versions",
    options: {
      current: {
        name: "1.0",
        label: "1.0",
      },
      versions: [
        {
          name: "0.9",
          label: "0.9",
          docsPrefix: "versions/0.9",
          routePrefix: "/versions/0.9",
        },
      ],
    },
  },
];
```

```ts
plugins: [
  {
    name: "@squidoc/plugin-i18n",
    options: {
      defaultLocale: "en",
      locales: [
        { code: "en", label: "English" },
        { code: "es", label: "Español" },
      ],
    },
  },
];
```

```ts
plugins: [
  "@squidoc/plugin-seo",
  "@squidoc/plugin-pages",
  "@squidoc/plugin-codeblocks",
  "@squidoc/plugin-article-tree",
];
```
