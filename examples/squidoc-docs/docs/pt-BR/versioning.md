---
title: "Versionamento"
description: "Guia do Squidoc sobre Versionamento."
---

# Versionamento

Esta página se concentra em documentação versionada e explica como essa parte funciona em um projeto Squidoc.

## O que você vai configurar

Você vai aprender a publicar docs atuais e arquivados em rotas estáveis.

## O que conferir antes de publicar

Verifique páginas ausentes entre versões e rotule resultados de busca com a versão.

## Leia também

[Configuração](/configuration) · [Plugins](/plugins) · [Deploy](/deployment)

## Exemplos

```bash
npx squidoc add plugin @squidoc/plugin-versions
```

```ts
export default defineConfig({
  plugins: [
    "@squidoc/plugin-seo",
    "@squidoc/plugin-codeblocks",
    "@squidoc/plugin-article-tree",
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
    },
  ],
});
```

```txt
docs/
  index.md
  configuration.md
  plugin-authoring.md
```

```txt
docs/
  versions/
    0.9/
      index.md
      configuration.md
      plugin-authoring.md
```

```ts
{
  name: "@squidoc/plugin-versions",
  options: {
    current: { name: "2.0", label: "2.0" },
    versions: [
      {
        name: "1.0",
        label: "1.0",
        docsPrefix: "archive/v1",
        routePrefix: "/v1",
      },
    ],
  },
}
```

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
