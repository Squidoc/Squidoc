---
title: Frontmatter
description: Reference the supported frontmatter fields for Squidoc documents.
---

# Frontmatter

Frontmatter is the YAML block at the top of a Markdown or MDX document. Squidoc reads it before rendering the page.

```md
---
title: API Guide
description: Learn how to use the API.
---

# API Guide
```

## Supported fields

`title` sets the page title used by themes, SEO metadata, generated indexes, and browser titles. If `title` is omitted, Squidoc falls back to the first `# Heading` in the document. If there is no heading, it derives a title from the file name.

`description` sets the page description used by SEO metadata, search results, and generated LLM files. Descriptions should be plain text and useful out of context.

## Unsupported fields

Additional frontmatter fields are preserved on the page data for future theme and plugin use, but Squidoc core only assigns behavior to `title` and `description` today.

```md
---
title: Release Notes
description: Product release notes.
owner: Docs Team
---
```

In this example, `owner` is available in the raw frontmatter data, but the default theme and built-in plugins do not use it yet.
