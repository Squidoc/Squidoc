---
title: Developers
description: Extend Squidoc with plugins, themes, and framework-level customization.
---

# Developers

Squidoc is designed to stay simple for authors while giving developers real extension points.

Use plugins when you want to add behavior such as generated files, metadata, new document formats, or theme slots. Use themes when you want to change layout, navigation, typography, or the page structure that receives normalized docs data.

## Extension surfaces

- Plugins run during Squidoc builds and can inspect config and discovered pages.
- Themes control the default renderer and can decide where plugin slots appear.
- The config file ties site metadata, navigation, plugins, and themes together.

The guides in this section cover the Phase 1 APIs and the direction for the deeper theme system.
