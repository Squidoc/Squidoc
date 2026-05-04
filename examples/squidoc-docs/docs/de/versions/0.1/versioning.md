---
title: "Versionierung"
description: "Dokumentation fuer Squidoc auf Deutsch."
---

# Versionierung

Squidoc ist eine statische Dokumentationsplattform mit Plugins, Themes und SEO-freundlichen Voreinstellungen. Schreibe Markdown, konfiguriere dein Projekt in docs.config.ts und veroeffentliche ein schnelles statisches Docs-Site.

## Projektstruktur

Dokumente liegen in docs/, optionale Astro-Seiten in pages/, und docs.config.ts verbindet Website-Metadaten, Navigation, Plugins und Theme.

## Erweitern

Plugins fuegen Verhalten wie Suche, SEO, Codebloecke, Versionierung, Internationalisierung und generierte Dateien hinzu. Themes steuern Layout, Navigation und Slots.

## Verifizieren

Nutze npm run check, npm run build und npm run preview, bevor du deployest.

## Versioning

Diese Seite folgt der englischen Dokumentation, damit alle unterstuetzten Sprachen dieselbe Abdeckung fuer die aktuelle Version haben.

[Erste Schritte](/getting-started) · [Konfiguration](/configuration) · [Plugins](/plugins) · [Themes](/themes) · [Deployment](/deployment)

## Referenzbeispiele

```bash
npx squidoc add plugin @squidoc/plugin-versions
```

```ts
export default defineConfig({
  plugins: [
    "@squidoc/plugin-seo",
    "@squidoc/plugin-codeblocks",
    "@squidoc/plugin-article-tree",
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
          },
        ],
      },
    },
  ],
});
```

```txt
docs/
  index.md
  configuration.md
  plugin-authoring.md
```

```txt
docs/
  versions/
    0.9/
      index.md
      configuration.md
      plugin-authoring.md
```

```ts
{
  name: "@squidoc/plugin-versions",
  options: {
    current: { name: "2.0", label: "2.0" },
    versions: [
      {
        name: "1.0",
        label: "1.0",
        docsPrefix: "archive/v1",
        routePrefix: "/v1",
      },
    ],
  },
}
```

```ts
{
  name: "@squidoc/plugin-versions",
  options: {
    current: {
      name: "next",
      label: "Next",
      routePrefix: "/next",
      hidden: true,
    },
    versions: [
      {
        name: "0.1",
        label: "0.1",
        routePrefix: "/",
        current: true,
      },
    ],
  },
}
```

```json
[
  {
    "name": "1.0",
    "label": "1.0",
    "routePrefix": "/docs",
    "current": true,
    "routes": ["/docs", "/docs/configuration"]
  },
  {
    "name": "0.9",
    "label": "0.9",
    "routePrefix": "/docs/versions/0.9",
    "current": false,
    "routes": ["/docs/versions/0.9", "/docs/versions/0.9/configuration"]
  }
]
```

```ts
{
  squidocVersion: "0.9",
  squidocVersionLabel: "0.9",
  squidocVersionRoutePrefix: "/docs/versions/0.9",
  squidocVersionCurrent: false,
}
```
