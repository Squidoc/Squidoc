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
