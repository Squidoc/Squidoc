import { type HeadTag, definePlugin } from "@squidoc/core";

export default definePlugin({
  name: "@squidoc/plugin-seo",
  setup(api) {
    const siteUrl = api.config.site.url?.replace(/\/$/, "");

    api.addHeadTags([
      {
        tag: "link",
        attrs: { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      },
      {
        tag: "link",
        attrs: { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      },
      {
        tag: "link",
        attrs: { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      },
      { tag: "link", attrs: { rel: "manifest", href: "/site.webmanifest" } },
      { tag: "link", attrs: { rel: "shortcut icon", href: "/favicon.ico" } },
    ]);

    api.addPageHeadTags((page) => {
      const description = page.description ?? api.config.site.description;
      const url = siteUrl ? `${siteUrl}${page.route}` : undefined;
      const alternates = siteUrl ? findAlternates(page, api.pages, siteUrl) : [];
      const tags: HeadTag[] = [
        {
          tag: "meta",
          attrs: { property: "og:title", content: `${page.title} | ${api.config.site.name}` },
        },
        { tag: "meta", attrs: { name: "twitter:card", content: "summary" } },
      ];

      if (description) {
        tags.push({ tag: "meta", attrs: { property: "og:description", content: description } });
      }

      if (url) {
        tags.push(
          { tag: "link", attrs: { rel: "canonical", href: url } },
          { tag: "meta", attrs: { property: "og:url", content: url } },
        );
      }

      tags.push(...alternates);

      return tags;
    });

    api.addGeneratedFile({
      path: "robots.txt",
      contents: ["User-agent: *", "Allow: /", siteUrl ? `Sitemap: ${siteUrl}/sitemap.xml` : "", ""]
        .filter(Boolean)
        .join("\n"),
    });

    if (siteUrl) {
      api.addGeneratedFile({
        path: "sitemap.xml",
        contents: [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...api.pages.map((page) => `  <url><loc>${siteUrl}${page.route}</loc></url>`),
          "</urlset>",
          "",
        ].join("\n"),
      });
    }
  },
});

function findAlternates(
  page: { frontmatter: Record<string, unknown> },
  pages: Array<{ route: string; frontmatter: Record<string, unknown> }>,
  siteUrl: string,
): HeadTag[] {
  const baseRoute = readString(page.frontmatter.squidocI18nBaseRoute);

  if (!baseRoute) {
    return [];
  }

  return pages
    .filter((candidate) => candidate.frontmatter.squidocI18nBaseRoute === baseRoute)
    .flatMap((candidate) => {
      const locale = readString(candidate.frontmatter.squidocLocale);

      return locale
        ? [
            {
              tag: "link" as const,
              attrs: {
                rel: "alternate",
                hreflang: locale,
                href: `${siteUrl}${candidate.route}`,
              },
            },
          ]
        : [];
    });
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}
