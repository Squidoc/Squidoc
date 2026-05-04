---
title: "Primeros pasos"
description: "Guía de Squidoc sobre Primeros pasos."
---

# Primeros pasos

Esta guía te lleva desde un proyecto vacío hasta una documentación local funcionando con el tema básico.

## Qué vas a configurar

Vas a crear el proyecto, instalar dependencias, iniciar el servidor de desarrollo y agregar tus primeros archivos Markdown.

## Qué revisar antes de publicar

Revisa que `npm run check` no reporte enlaces de navegación rotos y que `npm run build` genere el sitio estático antes de desplegar.

## También puedes leer

[Configuración](/configuration) · [Plugins](/plugins) · [Deployment](/deployment)

## Ejemplos

```bash
npm create squidoc@latest my-docs
cd my-docs
npm run dev
```

```md
---
title: API Guide
description: Learn how to use the API.
---

# API Guide

Write your documentation here.
```

```ts
nav: [
  { title: "Getting Started", path: "/getting-started" },
  { title: "API Guide", path: "/api-guide" },
];
```

```bash
npm run check
npm run build
npm run preview
```
