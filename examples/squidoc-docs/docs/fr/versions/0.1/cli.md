---
title: "Référence CLI"
description: "Guide Squidoc pour Référence CLI."
---

# Référence CLI

Cette page se concentre sur la CLI Squidoc et explique comment cette partie fonctionne dans un projet Squidoc.

## Ce que vous allez configurer

Vous allez apprendre à utiliser dev, build, preview, check, doctor et add au quotidien.

## À vérifier avant publication

`doctor` vérifie l’environnement; `check` vérifie projet et routes.

## À lire aussi

[Configuration](/configuration) · [Plugins](/plugins) · [Déploiement](/deployment)

## Exemples

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
