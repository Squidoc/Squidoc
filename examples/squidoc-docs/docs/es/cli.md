---
title: "Referencia de CLI"
description: "Guía de Squidoc sobre Referencia de CLI."
---

# Referencia de CLI

La CLI cubre el ciclo diario: desarrollo local, comprobaciones, build, preview, diagnóstico y agregar paquetes.

## Qué vas a configurar

Usa `squidoc dev`, `squidoc build`, `squidoc preview`, `squidoc check`, `squidoc doctor` y `squidoc add` según la etapa del proyecto.

## Qué revisar antes de publicar

Cuando algo falle, empieza por `doctor` para validar entorno y por `check` para validar rutas y configuración.

## También puedes leer

[Configuración](/configuration) · [Plugins](/plugins) · [Deployment](/deployment)

## Ejemplos

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

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run preview
```

```bash
npm run check
```

```bash
npm run doctor
```

```bash
npx squidoc add plugin @squidoc/plugin-search
npx squidoc add theme @squidoc/theme-basic
```
