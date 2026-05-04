---
title: "Versionado"
description: "Guía de Squidoc sobre Versionado."
---

# Versionado

El plugin de versionado publica docs actuales y archivadas bajo rutas estables.

## Qué vas a configurar

Configura la versión actual, agrega archivos bajo `docs/versions/<version>/` y decide qué versiones aparecen en el selector.

## Qué revisar antes de publicar

Revisa cambios de rutas entre versiones para evitar enlaces rotos y usa búsqueda con etiquetas de versión para no mezclar resultados sin contexto.

## También puedes leer

[Configuración](/configuration) · [Plugins](/plugins) · [Deployment](/deployment)

## Ejemplos

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
