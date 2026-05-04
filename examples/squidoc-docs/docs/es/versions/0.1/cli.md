---
title: Referencia CLI
description: Entiende squidoc dev, build, preview, check, doctor y add.
---

# Referencia CLI

El proyecto generado expone Squidoc mediante scripts de paquete, pero cada script llama a un comando CLI.

```json
{
  "scripts": {
    "dev": "squidoc dev",
    "build": "squidoc build",
    "preview": "squidoc preview",
    "check": "squidoc check",
    "doctor": "squidoc doctor"
  }
}
```

## `squidoc dev`

Inicia el servidor local de desarrollo. Observa documentos, configuración, plugins y temas, regenera el proyecto Astro interno y mantiene el servidor activo mientras editas.

```bash
npm run dev
```

## `squidoc build`

Compila el sitio de producción y escribe la salida estática en `dist/`.

```bash
npm run build
```

## `squidoc preview`

Sirve localmente la salida ya compilada en `dist/`.

```bash
npm run preview
```

## `squidoc check`

Valida el proyecto sin compilar el sitio.

```bash
npm run check
```

`check` detecta directorios de docs sin páginas, navegación que apunta a rutas faltantes y enlaces internos Markdown rotos. Ignora enlaces externos, enlaces solo con hash, correos y teléfonos.

## `squidoc doctor`

Imprime un reporte de salud del proyecto:

```bash
npm run doctor
```

`doctor` muestra la configuración resuelta, directorio de docs, páginas descubiertas, package manager detectado, tema activo, plugins configurados y los mismos problemas que reporta `check`.

## `squidoc add`

Instala un plugin o tema y actualiza `docs.config.ts`.

```bash
npx squidoc add plugin @squidoc/plugin-search
npx squidoc add theme @squidoc/theme-basic
```
