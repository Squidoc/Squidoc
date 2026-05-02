import { definePlugin } from "@squidoc/core";

export type SearchEntry = {
  title: string;
  description?: string;
  route: string;
  content: string;
  version?: {
    label: string;
    routePrefix: string;
    current: boolean;
  };
  locale?: {
    code: string;
    label: string;
    routePrefix: string;
    current: boolean;
  };
};

export default definePlugin({
  name: "@squidoc/plugin-search",
  setup(api) {
    const entries: SearchEntry[] = api.pages.map((page) => ({
      title: page.title,
      description: page.description,
      route: page.route,
      content: normalizeContent(page.content),
      version: readVersionMetadata(page.frontmatter),
      locale: readLocaleMetadata(page.frontmatter),
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
  <svg class="sq-search__icon sq-icon" aria-hidden="true" focusable="false">
    <use href="#sq-icon-search"></use>
  </svg>
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

  const activeLocale = resolveActiveLocale(entries);
  const activeVersion = resolveActiveVersion(entries, activeLocale);
  const matches = entries
    .filter((entry) => !activeLocale || entry.locale?.code === activeLocale.code)
    .filter((entry) => !activeVersion || entry.version?.routePrefix === activeVersion.routePrefix)
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

    if (entry.version) {
      const version = document.createElement("span");
      version.className = "sq-search__result-version";
      version.textContent = entry.version.label;
      title.append(version);
    }

    if (entry.description) {
      const description = document.createElement("span");
      description.className = "sq-search__result-description";
      description.textContent = entry.description;
      link.append(description);
    }

    return link;
  }));
});

function resolveActiveVersion(entries, activeLocale) {
  const versions = entries
    .filter((entry) => !activeLocale || entry.locale?.code === activeLocale.code)
    .map((entry) => entry.version)
    .filter(Boolean)
    .filter((version, index, all) => all.findIndex((item) => item.routePrefix === version.routePrefix) === index)
    .sort((first, second) => second.routePrefix.length - first.routePrefix.length);

  if (versions.length === 0) {
    return undefined;
  }

  const path = window.location.pathname.replace(/\\/+$/, "") || "/";

  return versions.find((version) => path === version.routePrefix || path.startsWith(version.routePrefix.replace(/\\/+$/, "") + "/"))
    ?? versions.find((version) => version.current)
    ?? versions[0];
}

function resolveActiveLocale(entries) {
  const locales = entries
    .map((entry) => entry.locale)
    .filter(Boolean)
    .filter((locale, index, all) => all.findIndex((item) => item.code === locale.code) === index)
    .sort((first, second) => second.routePrefix.length - first.routePrefix.length);

  if (locales.length === 0) {
    return undefined;
  }

  const path = window.location.pathname.replace(/\\/+$/, "") || "/";

  return locales.find((locale) => locale.routePrefix !== "/" && (path === locale.routePrefix || path.startsWith(locale.routePrefix.replace(/\\/+$/, "") + "/")))
    ?? locales.find((locale) => locale.current)
    ?? locales[0];
}
</script>`;
}

function readVersionMetadata(frontmatter: Record<string, unknown>): SearchEntry["version"] {
  const label = readString(frontmatter.squidocVersionLabel);
  const routePrefix = readString(frontmatter.squidocVersionRoutePrefix);
  const current = frontmatter.squidocVersionCurrent === true;

  return label && routePrefix ? { label, routePrefix, current } : undefined;
}

function readLocaleMetadata(frontmatter: Record<string, unknown>): SearchEntry["locale"] {
  const code = readString(frontmatter.squidocLocale);
  const label = readString(frontmatter.squidocLocaleLabel);
  const routePrefix = readString(frontmatter.squidocLocaleRoutePrefix);
  const current = frontmatter.squidocLocaleCurrent === true;

  return code && label && routePrefix ? { code, label, routePrefix, current } : undefined;
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

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}
