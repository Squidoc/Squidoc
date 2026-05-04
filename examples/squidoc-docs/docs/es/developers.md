---
title: Crear extensiones
description: Extiende Squidoc con plugins, temas y personalización avanzada.
---

# Crear extensiones

Squidoc está diseñado para mantenerse simple para autores y, al mismo tiempo, ofrecer puntos de extensión reales para desarrolladores.

Usa plugins cuando quieras agregar comportamiento: archivos generados, metadatos, nuevos formatos de documento o slots de UI. Usa temas cuando quieras cambiar layout, navegación, tipografía o la estructura que recibe los datos normalizados de la documentación.

## Superficies de extensión

- Los plugins corren durante los builds y pueden inspeccionar configuración y páginas descubiertas.
- Los temas controlan el renderer predeterminado y deciden dónde aparecen los slots de plugins.
- El archivo de configuración conecta metadatos del sitio, navegación, plugins y temas.

Comienza con [Crear plugins](/plugin-authoring) para agregar comportamiento o con [Crear temas](/theme-authoring) para cambiar estructura y presentación.
