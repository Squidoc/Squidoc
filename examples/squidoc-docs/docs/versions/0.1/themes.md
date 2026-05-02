---
title: Themes
description: Install Squidoc themes, configure the basic theme, and understand how themes control site structure.
---

# Themes

Themes control the structure and presentation of a Squidoc site. They decide where navigation appears, how articles are framed, where plugin slots render, and how the site responds across desktop and mobile.

The generated starter uses `@squidoc/theme-basic`:

```ts
export default defineConfig({
  theme: "@squidoc/theme-basic",
});
```

Use object form when a theme exposes options:

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
          { title: "Configuration", path: "/configuration" },
        ],
      },
    },
  },
});
```

## Installing a theme

Use the CLI:

```bash
npx squidoc add theme @acme/squidoc-theme
```

Or install the package yourself and update `docs.config.ts`:

```bash
npm install @acme/squidoc-theme
```

```ts
export default defineConfig({
  theme: "@acme/squidoc-theme",
});
```

## Basic theme options

`primaryColor` controls the default accent color used for links, buttons, focused inputs, and active UI states. The basic theme defaults to Squidoc's primary color, `#4a54df`.

```ts
primaryColor: "#4a54df";
```

`headerLinks` adds links to the desktop navbar. Use `href` for external links and `path` for internal docs routes.

```ts
headerLinks: [
  { title: "GitHub", href: "https://github.com/Squidoc/Squidoc" },
  { title: "Deployment", path: "/deployment" },
];
```

`footer` controls the footer text and footer links:

```ts
footer: {
  text: "Built with Squidoc.",
  links: [
    { title: "GitHub", href: "https://github.com/Squidoc/Squidoc" },
    { title: "Plugins", path: "/plugins" },
  ],
};
```

## Choosing a theme

Use a theme when you want to change more than a color token. Squidoc themes can change layout, navigation placement, headers, footers, widgets, typography, and where plugin UI appears.

If you want to build your own, start with [Theme Authoring](/theme-authoring).
