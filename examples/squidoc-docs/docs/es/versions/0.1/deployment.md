---
title: Despliegue
description: Publica un sitio Squidoc en Vercel, Netlify, Cloudflare Pages, GitHub Pages, Docker y hosts estáticos.
---

# Despliegue

Squidoc genera un sitio estático. En producción normalmente ejecutas `npm run build` y sirves el directorio `dist/` desde cualquier host estático.

Antes de desplegar, corre las mismas verificaciones que debería correr CI:

```bash
npm run check
npm run build
npm run preview
```

## Vercel

Crea un proyecto Vercel desde tu repositorio y usa:

- Framework preset: `Other`
- Build command: `npm run build`
- Output directory: `dist`
- Install command: el comando de tu package manager, por ejemplo `npm install`, `pnpm install`, `yarn install` o `bun install`

Si el sitio vive en un monorepo, configura el root directory en la carpeta que contiene `package.json` y `docs.config.ts`.

## Netlify

Usa:

- Build command: `npm run build`
- Publish directory: `dist`

También puedes agregar `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

## Cloudflare Pages

Usa:

- Framework preset: `None`
- Build command: `npm run build`
- Build output directory: `dist`

Cloudflare Pages funciona bien porque Squidoc produce HTML, CSS, JavaScript y assets estáticos.

## GitHub Pages

GitHub Pages puede desplegar `dist/` con GitHub Actions. El workflow debe instalar dependencias, ejecutar `npm run check`, compilar con `npm run build` y subir `dist` con `actions/upload-pages-artifact`.

Si despliegas en un subpath, configura `site.url` con la URL pública final para que canonical URLs, sitemap y archivos SEO apunten al lugar correcto.

## Docker

Usa Docker cuando quieras empaquetar el sitio como contenedor. Compila con Node y sirve `dist/` con Nginx:

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

Para pnpm, yarn o bun, cambia el lockfile y el comando de instalación.

## Hosting estático

Cualquier host que sirva archivos estáticos puede publicar Squidoc. Ejecuta `npm run build` y sube el contenido de `dist/`.

## Ejemplos de referencia

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

```bash
npm run build
```
