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
      html: renderSearchSlot(),
    });
  },
});

function renderSearchSlot(): string {
  return `<div class="sq-search" data-squidoc-search>
  <label class="sq-search__label" for="squidoc-search-input">Search docs</label>
  <input class="sq-search__input" id="squidoc-search-input" type="search" placeholder="Search" autocomplete="off" />
  <div class="sq-search__results" id="squidoc-search-results" role="list"></div>
</div>
<script type="module">
const root = document.querySelector("[data-squidoc-search]");
const input = document.querySelector("#squidoc-search-input");
const results = document.querySelector("#squidoc-search-results");
let entries = [];

fetch("/search-index.json")
  .then((response) => response.ok ? response.json() : [])
  .then((data) => {
    entries = Array.isArray(data) ? data : [];
  })
  .catch(() => {
    entries = [];
  });

input?.addEventListener("input", () => {
  const query = input.value.trim().toLowerCase();

  if (!query) {
    results.replaceChildren();
    root?.removeAttribute("data-has-results");
    root?.removeAttribute("data-has-query");
    return;
  }

  const matches = entries
    .filter((entry) => [entry.title, entry.description, entry.content].filter(Boolean).join(" ").toLowerCase().includes(query))
    .slice(0, 6);

  root?.setAttribute("data-has-query", "");
  root?.toggleAttribute("data-has-results", matches.length > 0);

  if (matches.length === 0) {
    const empty = document.createElement("p");
    empty.className = "sq-search__empty";
    empty.textContent = "No results found.";
    results.replaceChildren(empty);
    return;
  }

  results.replaceChildren(...matches.map((entry) => {
    const link = document.createElement("a");
    link.className = "sq-search__result";
    link.href = entry.route;
    link.setAttribute("role", "listitem");

    const title = document.createElement("span");
    title.className = "sq-search__result-title";
    title.textContent = entry.title;
    link.append(title);

    if (entry.description) {
      const description = document.createElement("span");
      description.className = "sq-search__result-description";
      description.textContent = entry.description;
      link.append(description);
    }

    return link;
  }));
});
</script>`;
}

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
