---
title: Introducción
description: Aprende qué es Squidoc, cómo funciona y por dónde empezar.
---

# Squidoc

Squidoc es una plataforma de documentación estática con plugins, temas potentes y valores predeterminados pensados para SEO.

Está diseñada para que los primeros minutos sean simples: crea un proyecto, escribe Markdown, levanta un servidor local y publica un sitio estático rápido. Debajo de ese flujo sencillo, Squidoc mantiene una arquitectura modular para que los usuarios avanzados puedan agregar búsqueda, MDX, archivos para LLMs, SEO personalizado y temas completos sin reemplazar el pipeline de documentación.

## El modelo mental

Un proyecto Squidoc tiene cinco piezas principales:

- `docs/` contiene los artículos que se publican en `/docs` por defecto.
- `pages/` contiene páginas Astro opcionales para rutas como `/` o `/changelog`.
- `docs.config.ts` define los datos del sitio, la navegación, los plugins y el tema activo.
- Los plugins agregan comportamiento como metadatos SEO, archivos generados, páginas personalizadas, búsqueda, bloques de código, árboles de encabezados y nuevos formatos de documento.
- Los temas deciden cómo se convierten los documentos y páginas en navegación, cabeceras, pies de página y layouts.

Squidoc genera un proyecto Astro interno durante desarrollo y build. No necesitas escribir páginas Astro para usar Squidoc; Astro es el motor de render estático que permite builds rápidos, salida estática y despliegues sencillos.

## Empieza aquí

Comienza con [Primeros pasos](/getting-started), luego lee [Configuración](/configuration), [Frontmatter](/frontmatter), [Páginas](/pages) y la [Referencia CLI](/cli). Cuando estés listo para publicar, sigue la guía de [Despliegue](/deployment).
