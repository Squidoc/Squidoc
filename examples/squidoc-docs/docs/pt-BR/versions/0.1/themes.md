---
title: "Temas"
description: "Guia do Squidoc sobre Temas."
---

# Temas

Esta página se concentra em temas e explica como essa parte funciona em um projeto Squidoc.

## O que você vai configurar

Você vai aprender a trocar layout, navegação, rodapé, slots e opções visuais.

## O que conferir antes de publicar

Um tema deve suportar os layouts estáveis `docs` e `page`.

## Leia também

[Configuração](/configuration) · [Plugins](/plugins) · [Deploy](/deployment)

## Exemplos

```ts
export default defineConfig({
  theme: "@squidoc/theme-basic",
});
```

```ts
export default defineConfig({
  theme: {
    name: "@squidoc/theme-basic",
    options: {
      headerLinks: [{ title: "GitHub", href: "https://github.com/Squidoc/Squidoc" }],
      footer: {
        text: "Built with Squidoc.",
        links: [
          { title: "GitHub", href: "https://github.com/Squidoc/Squidoc" },
          { title: "Configuration", path: "/docs/configuration" },
        ],
      },
    },
  },
});
```

```bash
npx squidoc add theme @acme/squidoc-theme
```

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
