---
title: "Versionierung"
description: "Squidoc-Dokumentation zu Versionierung."
---

# Versionierung

Diese Seite konzentriert sich auf versionierte Dokumentation und erklärt, wie dieser Teil in einem Squidoc-Projekt funktioniert.

## Was du einstellst

Hier lernst du, wie du aktuelle und archivierte Docs unter stabilen Routen veröffentlichen kannst.

## Vor dem Veröffentlichen prüfen

Prüfe fehlende Seiten zwischen Versionen und markiere Suchergebnisse klar mit der Version.

## Weitere Themen

[Konfiguration](/configuration) · [Plugins](/plugins) · [Deployment](/deployment)

## Beispiele

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
