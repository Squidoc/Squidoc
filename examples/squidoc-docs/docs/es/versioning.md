---
title: Versionado
description: Agrega documentación versionada con @squidoc/plugin-versions.
---

# Versionado

Usa `@squidoc/plugin-versions` cuando tu documentación necesita describir varias versiones publicadas del mismo proyecto. Es útil cuando una versión nueva cambia APIs, campos de configuración, paquetes o puntos de extensión.

```bash
npx squidoc add plugin @squidoc/plugin-versions
```

## Configuración básica

```ts
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
}
```

## Estructura de archivos

Mantén la documentación principal en `docs/`:

```txt
docs/
  index.md
  configuration.md
```

Coloca versiones archivadas en `docs/versions/<name>/`:

```txt
docs/
  versions/
    0.9/
      index.md
      configuration.md
```

Por defecto, `docs/versions/0.9/configuration.md` se publica como `/docs/versions/0.9/configuration`.

## Prefijos personalizados

Usa `docsPrefix` para cambiar dónde vive una versión en disco y `routePrefix` para cambiar su URL pública.

`current: true` marca una versión como activa para el selector y la búsqueda. `hidden: true` permite publicar una versión sin mostrarla en el selector, útil para una rama `Next`.

## Qué agrega

El plugin genera `versions.json`, agrega el slot `version-selector` y escribe metadata de versión en cada página:

```ts
{
  squidocVersion: "0.9",
  squidocVersionLabel: "0.9",
  squidocVersionRoutePrefix: "/docs/versions/0.9",
  squidocVersionCurrent: false,
}
```

## Páginas faltantes

Al cambiar de versión, Squidoc intenta mantener al lector en la página equivalente. Si no existe, lo envía al inicio de la versión destino en lugar de mostrar 404.

## Búsqueda

Cuando búsqueda y versionado están habilitados, los resultados se limitan a la versión activa y muestran la etiqueta de versión junto al título.

## Idiomas

Versionado se implementa como transform del proyecto. Eso permite componerlo con i18n y mantener rutas localizadas y versionadas de forma consistente.

## Ejemplos de referencia

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
