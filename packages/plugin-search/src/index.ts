import { definePlugin } from "@squidoc/core";

export type SearchEntry = {
  title: string;
  description?: string;
  route: string;
  content: string;
};

export default definePlugin({
  name: "@squidoc/plugin-search",
  setup(api) {
    const entries: SearchEntry[] = api.pages.map((page) => ({
      title: page.title,
      description: page.description,
      route: page.route,
      content: normalizeContent(page.content),
    }));

    api.addGeneratedFile({
      path: "search-index.json",
      contents: `${JSON.stringify(entries, null, 2)}\n`,
    });

    api.addThemeSlot({
      name: "search",
      component: "@squidoc/plugin-search/Search.astro",
    });
  },
});

function normalizeContent(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[#>*_~|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
