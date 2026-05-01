---
title: Configuración
description: Configura el sitio Squidoc con plugins, temas, navegación e idiomas.
---

# Configuración

Squidoc usa `docs.config.ts` como la fuente principal de configuración. Ahí defines los datos del sitio, los plugins, el tema, la navegación y las opciones de internacionalización.

```ts
export default defineConfig({
  site: {
    name: "Squidoc",
  },
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
  ],
});
```

## Rutas

El idioma principal se publica en `/docs`. Los idiomas adicionales se publican con el prefijo del idioma, como `/es/docs`.
