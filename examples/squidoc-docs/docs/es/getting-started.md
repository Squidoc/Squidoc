---
title: Primeros pasos
description: Crea un proyecto Squidoc, ejecútalo localmente y compila documentación estática.
---

# Primeros pasos

Crea un proyecto nuevo con el generador:

```bash
npm create squidoc@latest my-docs
cd my-docs
npm run dev
```

El proyecto generado incluye:

- `docs.config.ts` para metadatos, navegación, plugins y tema.
- `docs/` para artículos Markdown.
- `pages/` para páginas Astro personalizadas como homepages o changelogs.
- Scripts en `package.json` para desarrollo, validación, builds y previews.
- El tema básico y plugins predeterminados para SEO, páginas, bloques de código y árbol del artículo.

## Agrega tu primera página

Crea un archivo Markdown en `docs/`:

```md
---
title: Guía API
description: Aprende a usar la API.
---

# Guía API

Escribe tu documentación aquí.
```

Luego agrégalo a `docs.config.ts`:

```ts
nav: [
  { title: "Primeros pasos", path: "/getting-started" },
  { title: "Guía API", path: "/api-guide" },
];
```

Por defecto, `docs/api-guide.md` se publica como `/docs/api-guide` y `docs/index.md` como `/docs`.

## Valida antes de publicar

Usa la CLI mientras trabajas:

```bash
npm run check
npm run build
npm run preview
```

`npm run check` detecta navegación y enlaces internos rotos. `npm run build` escribe el sitio en `dist/`. `npm run preview` sirve la salida de producción localmente.

Luego continúa con [Frontmatter](/frontmatter), [Plugins](/plugins), [Páginas](/pages), [Temas](/themes) y [Despliegue](/deployment).
