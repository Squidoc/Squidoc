---
title: Navegación lateral
description: Configura navegación manual, automática y mixta en Squidoc.
---

# Navegación lateral

Squidoc soporta sidebars manuales, generados y mixtos. La navegación manual es ideal cuando quieres control exacto. La navegación generada funciona mejor cuando tu árbol de docs ya coincide con la forma en que los lectores deben explorar.

## Navegación manual

El formato manual es el arreglo `nav`. Las rutas son relativas a docs, así que `/configuration` apunta a `docs/configuration.md`.

```ts
export default defineConfig({
  nav: [
    { title: "Introducción", path: "/" },
    { title: "Configuración", path: "/configuration" },
    {
      title: "Desarrolladores",
      path: "/developers",
      items: [
        { title: "Crear plugins", path: "/plugin-authoring" },
        { title: "Crear temas", path: "/theme-authoring" },
      ],
    },
  ],
});
```

Las carpetas también pueden ser artículos. Cuando un item tiene `path` e `items`, hacer clic abre el artículo y el sidebar puede expandir sus hijos.

## Navegación automática

Usa `"auto"` para que Squidoc construya el sidebar desde todos los documentos descubiertos:

```ts
export default defineConfig({
  nav: "auto",
});
```

Squidoc usa títulos de frontmatter, `nav.title`, `nav.order` y la estructura de carpetas para crear una navegación predecible.

## Navegación mixta

Puedes mezclar secciones manuales con contenido generado:

```ts
nav: [
  { title: "Inicio", path: "/" },
  {
    title: "Referencia",
    autogenerate: {
      from: "/reference",
      generatedPosition: "after",
    },
    items: [{ title: "Resumen", path: "/reference" }],
  },
];
```

`generatedPosition` controla si los items generados aparecen antes o después de los items manuales de esa sección.

## Ocultar páginas

Usa frontmatter para ocultar páginas del sidebar generado:

```md
---
title: Interno
nav:
  hidden: true
  hideChildren: true
---
```

`hidden` oculta la página. `hideChildren` también oculta sus hijos, útil para carpetas internas.

## Ejemplos de referencia

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
