import { definePlugin } from "@squidoc/core";

export default definePlugin({
  name: "@squidoc/plugin-llms",
  setup(api) {
    const siteName = api.config.site.name;
    const siteDescription = api.config.site.description;
    const siteUrl = api.config.site.url?.replace(/\/$/, "");
    const pages = [...api.pages].sort((a, b) => a.route.localeCompare(b.route));

    api.addGeneratedFile({
      path: "llms.txt",
      contents: [
        `# ${siteName}`,
        siteDescription ? `\n${siteDescription}` : "",
        "\n## Docs",
        ...pages.map(
          (page) =>
            `- [${page.title}](${formatUrl(siteUrl, page.route)})${formatDescription(page.description)}`,
        ),
        "",
      ].join("\n"),
    });

    api.addGeneratedFile({
      path: "llms-full.txt",
      contents: [
        `# ${siteName}`,
        siteDescription ? `\n${siteDescription}` : "",
        ...pages.flatMap((page) => [
          "",
          "---",
          "",
          `# ${page.title}`,
          page.description ? `\n${page.description}` : "",
          "",
          `Source: ${formatUrl(siteUrl, page.route)}`,
          "",
          page.content.trim(),
        ]),
        "",
      ].join("\n"),
    });
  },
});

function formatUrl(siteUrl: string | undefined, route: string): string {
  return siteUrl ? `${siteUrl}${route}` : route;
}

function formatDescription(description: string | undefined): string {
  return description ? ` - ${description}` : "";
}
