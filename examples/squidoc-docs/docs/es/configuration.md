---
title: Configuración
description: Configura metadatos del sitio, navegación, plugins y temas.
---

# Configuración

Los proyectos Squidoc se configuran con `docs.config.ts`.

```ts
import { defineConfig } from "squidoc";

export default defineConfig({
  site: {
    name: "Mis Docs",
    url: "https://docs.example.com",
    description: "Documentación creada con Squidoc",
  },
  docs: {
    basePath: "/docs",
  },
  plugins: [
    "@squidoc/plugin-seo",
    "@squidoc/plugin-pages",
    "@squidoc/plugin-codeblocks",
    "@squidoc/plugin-article-tree",
  ],
  theme: {
    name: "@squidoc/theme-basic",
    options: {
      headerLinks: [{ title: "GitHub", href: "https://github.com/Squidoc/Squidoc" }],
    },
  },
  nav: [
    { title: "Introducción", path: "/" },
    { title: "Primeros pasos", path: "/getting-started" },
    { title: "Configuración", path: "/configuration" },
  ],
});
```

El objeto `site` alimenta títulos, metadatos, archivos SEO generados y plantillas de tema. `docs.basePath` controla dónde se publica la documentación; por defecto es `/docs`. Las rutas de navegación son relativas a `docs/`, así que `/configuration` apunta a `docs/configuration.md` y se publica como `/docs/configuration`.

`squidoc check` detecta rutas de navegación faltantes antes del despliegue. La navegación puede ser manual, automática o mixta. Consulta [Navegación lateral](/navigation) para ver ejemplos.

## Plugins y temas

Agrega plugins y temas con la CLI:

```bash
npx squidoc add plugin @squidoc/plugin-search
npx squidoc add theme @squidoc/theme-basic
```

Usa forma de objeto cuando un plugin expone opciones:

```ts
plugins: [
  {
    name: "@acme/squidoc-plugin-example",
    options: {
      message: "Generado desde opciones del plugin.",
    },
  },
];
```

Los plugins pueden agregar archivos generados, metadatos, extensiones de documentos y slots de tema. Los temas controlan la estructura, clases y estilos del sitio.

Para metadatos por página, lee [Frontmatter](/frontmatter). Para comandos, consulta la [Referencia CLI](/cli).
