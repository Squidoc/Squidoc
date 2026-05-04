---
title: "Seitenleisten-Navigation"
description: "Squidoc-Dokumentation zu Seitenleisten-Navigation."
---

# Seitenleisten-Navigation

Diese Seite konzentriert sich auf die Seitenleiste und erklärt, wie dieser Teil in einem Squidoc-Projekt funktioniert.

## Was du einstellst

Hier lernst du, wie du manuelle, automatische oder gemischte Navigation aus dem Docs-Baum erstellen kannst.

## Vor dem Veröffentlichen prüfen

Versteckte Ordner und generierte Abschnitte sollten getestet werden, damit keine Einträge unerwartet verschwinden.

## Weitere Themen

[Konfiguration](/configuration) · [Plugins](/plugins) · [Deployment](/deployment)

## Beispiele

```ts
export default defineConfig({
  nav: [
    { title: "Introduction", path: "/" },
    { title: "Configuration", path: "/configuration" },
    {
      title: "Developers",
      path: "/developers",
      items: [
        { title: "Plugin Authoring", path: "/plugin-authoring" },
        { title: "Theme Authoring", path: "/theme-authoring" },
      ],
    },
  ],
});
```

```ts
export default defineConfig({
  nav: "auto",
});
```

```txt
docs/
  index.md
  getting-started.md
  developers/
    index.md
    plugin-authoring.md
    theme-authoring.md
```

```ts
export default defineConfig({
  nav: {
    autogenerate: {
      from: "/developers",
    },
  },
});
```

```ts
export default defineConfig({
  nav: [
    { title: "Introduction", path: "/" },
    {
      title: "Developers",
      autogenerate: {
        from: "/developers",
      },
    },
    {
      title: "Reference",
      items: [{ title: "CLI", path: "/cli" }],
    },
  ],
});
```

```ts
{
  title: "Developers",
  autogenerate: {
    from: "/developers",
  },
  items: [
    { title: "External API", path: "/external-api" },
  ],
}
```

```ts
{
  title: "Developers",
  autogenerate: {
    from: "/developers",
    generatedPosition: "after",
  },
  items: [
    { title: "Overview", path: "/developers/overview" },
  ],
}
```

```ts
export default defineConfig({
  nav: {
    autogenerate: {
      from: "/",
      exclude: ["versions/**", "es/**"],
    },
  },
});
```

```md
---
title: Plugin Authoring
nav:
  title: Plugins
  order: 20
---
```

```md
---
title: Internal Migration Notes
nav:
  hidden: true
---
```

```md
---
title: Internal Notes
nav:
  hidden: true
  hideChildren: true
---
```
