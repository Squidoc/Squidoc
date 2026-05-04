---
title: Temas
description: Instala temas Squidoc, configura el tema básico y entiende cómo controlan la estructura.
---

# Temas

Los temas controlan estructura y presentación. Deciden dónde aparece la navegación, cómo se enmarcan los artículos, dónde se renderizan slots de plugins y cómo responde el sitio en desktop y mobile.

El starter usa `@squidoc/theme-basic`:

```ts
export default defineConfig({
  theme: "@squidoc/theme-basic",
});
```

Usa forma de objeto cuando el tema expone opciones:

```ts
theme: {
  name: "@squidoc/theme-basic",
  options: {
    headerLinks: [{ title: "GitHub", href: "https://github.com/Squidoc/Squidoc" }],
    footer: {
      text: "Creado con Squidoc.",
      links: [{ title: "Configuración", path: "/docs/configuration" }],
    },
  },
};
```

## Instalar un tema

```bash
npx squidoc add theme @acme/squidoc-theme
```

O instala el paquete y actualiza `docs.config.ts`.

## Opciones del tema básico

`primaryColor` controla el color de acento para enlaces, botones, inputs enfocados y estados activos. El valor predeterminado es `#4a54df`.

`headerLinks` agrega enlaces a la navbar. Usa `href` para externos y `path` para rutas internas.

`footer` controla el texto y enlaces del pie de página.

## Elegir un tema

Usa un tema cuando quieres cambiar más que un color. Los temas pueden cambiar layout, navegación, cabeceras, footers, widgets, tipografía y ubicación de slots.

Para crear uno, empieza con [Crear temas](/theme-authoring).

## Ejemplos de referencia

```bash
npm install @acme/squidoc-theme
```

```ts
export default defineConfig({
  theme: "@acme/squidoc-theme",
});
```

```ts
primaryColor: "#4a54df";
```

```ts
headerLinks: [
  { title: "GitHub", href: "https://github.com/Squidoc/Squidoc" },
  { title: "Deployment", path: "/docs/deployment" },
];
```

```ts
footer: {
  text: "Built with Squidoc.",
  links: [
    { title: "GitHub", href: "https://github.com/Squidoc/Squidoc" },
    { title: "Plugins", path: "/docs/plugins" },
  ],
};
```
