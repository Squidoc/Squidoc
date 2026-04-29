import { definePlugin } from "@squidoc/core";

export default definePlugin({
  name: "@squidoc/plugin-seo",
  setup(api) {
    const siteUrl = api.config.site.url?.replace(/\/$/, "");

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
