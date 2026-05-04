---
title: "Navigation latérale"
description: "Guide Squidoc pour Navigation latérale."
---

# Navigation latérale

Cette page se concentre sur la barre latérale et explique comment cette partie fonctionne dans un projet Squidoc.

## Ce que vous allez configurer

Vous allez apprendre à créer une navigation manuelle, automatique ou mixte depuis l’arborescence.

## À vérifier avant publication

Testez dossiers masqués et sections générées pour éviter des liens inattendus.

## À lire aussi

[Configuration](/configuration) · [Plugins](/plugins) · [Déploiement](/deployment)

## Exemples

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
