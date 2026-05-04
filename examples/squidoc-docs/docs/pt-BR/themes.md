---
title: "Temas"
description: "Documentação do Squidoc em português do Brasil."
---

# Temas

Squidoc é uma plataforma de documentação estática com plugins, temas e padrões pensados para SEO. Escreva Markdown, configure o projeto em docs.config.ts e publique um site estático rápido.

## Estrutura do projeto

Os artigos ficam em docs/, páginas Astro opcionais ficam em pages/, e docs.config.ts conecta metadados, navegação, plugins e tema.

## Extensão

Plugins adicionam busca, SEO, blocos de código, versionamento, internacionalização e arquivos gerados. Temas controlam layouts, navegação e slots.

## Validação

Antes do deploy, execute npm run check, npm run build e npm run preview.

## Temas

Esta página acompanha a documentação em inglês para manter a mesma cobertura em todos os idiomas suportados na versão atual.

[Primeiros passos](/getting-started) · [Configuração](/configuration) · [Plugins](/plugins) · [Deploy](/deployment)

## Exemplos de referência

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
