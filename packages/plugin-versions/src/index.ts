import { type DocPage, type NavItem, definePlugin } from "@squidoc/core";

export type VersionsOptions = {
  current?: VersionConfig;
  versions?: VersionConfig[];
};

type VersionConfig = {
  name: string;
  label?: string;
  routePrefix?: string;
  docsPrefix?: string;
};

type ResolvedVersion = {
  name: string;
  label: string;
  routePrefix: string;
  docsPrefix?: string;
  current: boolean;
};

type VersionManifestEntry = {
  name: string;
  label: string;
  routePrefix: string;
  current: boolean;
  locale?: {
    code: string;
    label: string;
    current: boolean;
  };
  routes: string[];
};

export default definePlugin({
  name: "@squidoc/plugin-versions",
  setup(api) {
    const versions = resolveVersions(api.pluginOptions, api.config.docs.basePath);

    api.addProjectTransformer((project) => {
      const pages = project.pages.map((page) => transformPage(page, versions, project.nav));

      return { pages, nav: project.nav };
    });

    api.addGeneratedFile({
      path: "versions.json",
      contents: `${JSON.stringify(toManifest(versions, api.pages), null, 2)}\n`,
    });

    api.addThemeSlot({
      name: "version-selector",
      component: "@squidoc/plugin-versions/VersionSelector.astro",
      html: renderVersionSelector(versions, api.pages),
    });
  },
});

function resolveVersions(
  options: Record<string, unknown>,
  docsBasePath: string,
): ResolvedVersion[] {
  const current = readVersionConfig(options.current) ?? { name: "current", label: "Current" };
  const archived = Array.isArray(options.versions)
    ? options.versions.flatMap((version) => {
        const config = readVersionConfig(version);
        return config ? [config] : [];
      })
    : [];

  return [
    {
      name: current.name,
      label: current.label ?? current.name,
      routePrefix: joinRoutes(docsBasePath, current.routePrefix ?? "/"),
      docsPrefix: current.docsPrefix,
      current: true,
    },
    ...archived.map((version) => ({
      name: version.name,
      label: version.label ?? version.name,
      routePrefix: joinRoutes(docsBasePath, version.routePrefix ?? `/versions/${version.name}`),
      docsPrefix: normalizeDocsPrefix(version.docsPrefix ?? `versions/${version.name}`),
      current: false,
    })),
  ];
}

function transformPage(page: DocPage, versions: ResolvedVersion[], nav: NavItem[]): DocPage {
  const matched = findVersionForPage(page, versions);

  if (!matched) {
    return page;
  }

  return {
    ...page,
    route: matched.route,
    nav: rewriteNav(nav, matched.version.routePrefix),
    frontmatter: {
      ...page.frontmatter,
      squidocVersion: matched.version.name,
      squidocVersionLabel: matched.version.label,
      squidocVersionRoutePrefix: matched.version.routePrefix,
      squidocVersionCurrent: matched.version.current,
    },
  };
}

function findVersionForPage(
  page: DocPage,
  versions: ResolvedVersion[],
): { version: ResolvedVersion; route: string } | undefined {
  const archived = versions.filter((version) => !version.current && version.docsPrefix);
  const sourceRoute = stripLeadingSlash(page.docsRoute);

  for (const version of archived) {
    const docsPrefix = version.docsPrefix ?? "";

    if (sourceRoute === docsPrefix || sourceRoute.startsWith(`${docsPrefix}/`)) {
      const remainder = sourceRoute.slice(docsPrefix.length).replace(/^\/+/, "");
      return {
        version,
        route: joinRoutes(version.routePrefix, remainder),
      };
    }
  }

  const current = versions.find((version) => version.current);

  return current ? { version: current, route: page.route } : undefined;
}

function rewriteNav(items: NavItem[], routePrefix: string): NavItem[] {
  return items.map((item) => ({
    ...item,
    path: item.path ? joinRoutes(routePrefix, item.path) : undefined,
    items: item.items ? rewriteNav(item.items, routePrefix) : undefined,
  }));
}

function renderVersionSelector(versions: ResolvedVersion[], pages: DocPage[]): string {
  if (versions.length <= 1) {
    return "";
  }

  const manifest = JSON.stringify(toManifest(versions, pages));

  return `<div class="sq-version-selector" data-squidoc-versions data-versions="${escapeHtml(
    manifest,
  )}">
  <label class="sq-version-selector__label" for="squidoc-version-selector">Version</label>
  <select class="sq-version-selector__select" id="squidoc-version-selector" aria-label="Documentation version">
  </select>
</div>
<script type="module">
(() => {
  const root = document.querySelector("[data-squidoc-versions]");
  const select = document.querySelector("#squidoc-version-selector");

  if (!(root instanceof HTMLElement) || !(select instanceof HTMLSelectElement)) {
    return;
  }

  const versions = JSON.parse(root.dataset.versions ?? "[]");
  const path = window.location.pathname.replace(/\\/+$/, "") || "/";
  const active = resolveActiveVersion(versions, path);
  const scopedVersions = versions.filter((version) => sameLocale(version, active));

  select.replaceChildren(...scopedVersions.map((version) => {
    const option = document.createElement("option");
    option.value = version.routePrefix;
    option.textContent = version.label;
    return option;
  }));

  if (active) {
    select.value = active.routePrefix;
  }

  select.addEventListener("change", () => {
    const target = scopedVersions.find((version) => version.routePrefix === select.value);

    if (!target || !active) {
      return;
    }

    const relative = path === active.routePrefix ? "" : path.slice(active.routePrefix.length).replace(/^\\/+/, "");
    const candidate = [target.routePrefix.replace(/\\/+$/, ""), relative].filter(Boolean).join("/");
    const nextPath = target.routes.includes(candidate.startsWith("/") ? candidate : "/" + candidate)
      ? candidate
      : target.routePrefix;
    window.location.href = nextPath.startsWith("/") ? nextPath : "/" + nextPath;
  });

  function resolveActiveVersion(versions, path) {
    return versions
    .filter((version) => version.routePrefix !== "/")
    .sort((first, second) => second.routePrefix.length - first.routePrefix.length)
    .find((version) => path === version.routePrefix || path.startsWith(version.routePrefix.replace(/\\/+$/, "") + "/")) ?? versions.find((version) => version.routePrefix === "/" && path === "/") ?? versions.find((version) => version.current);
  }

  function sameLocale(version, active) {
    if (!active) {
      return !version.locale || version.locale.current;
    }

    return (version.locale?.code ?? "") === (active.locale?.code ?? "");
  }
})();
</script>`;
}

function toManifest(versions: ResolvedVersion[], pages: DocPage[]): VersionManifestEntry[] {
  const localized = pages
    .map((page) => ({
      name: readString(page.frontmatter.squidocVersion),
      label: readString(page.frontmatter.squidocVersionLabel),
      routePrefix: readString(page.frontmatter.squidocVersionRoutePrefix),
      current: page.frontmatter.squidocVersionCurrent === true,
      localeCode: readString(page.frontmatter.squidocLocale),
      localeLabel: readString(page.frontmatter.squidocLocaleLabel),
      localeCurrent: page.frontmatter.squidocLocaleCurrent === true,
    }))
    .filter((entry) => entry.name && entry.label && entry.routePrefix);

  const source =
    localized.length > 0
      ? localized
      : versions.map((version) => ({
          name: version.name,
          label: version.label,
          routePrefix: version.routePrefix,
          current: version.current,
          localeCode: undefined,
          localeLabel: undefined,
          localeCurrent: false,
        }));
  const routePrefixes = [
    ...new Set(source.flatMap((entry) => (entry.routePrefix ? [entry.routePrefix] : []))),
  ];

  return routePrefixes.map((routePrefix) => {
    const entry = source.find((item) => item.routePrefix === routePrefix);

    return {
      name: entry?.name ?? routePrefix,
      label: entry?.label ?? routePrefix,
      routePrefix: routePrefix ?? "/",
      current: entry?.current ?? false,
      locale:
        entry?.localeCode && entry.localeLabel
          ? {
              code: entry.localeCode,
              label: entry.localeLabel,
              current: entry.localeCurrent,
            }
          : undefined,
      routes: pages
        .filter((page) => page.frontmatter.squidocVersionRoutePrefix === routePrefix)
        .map((page) => page.route)
        .sort(),
    };
  });
}

function readVersionConfig(value: unknown): VersionConfig | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const name = readString(value.name);

  if (!name) {
    return undefined;
  }

  return {
    name,
    label: readString(value.label),
    routePrefix: readString(value.routePrefix),
    docsPrefix: readString(value.docsPrefix),
  };
}

function normalizeRoutePrefix(value: string): string {
  const prefixed = value.startsWith("/") ? value : `/${value}`;
  const normalized = prefixed.replace(/\/+$/, "");

  return normalized === "" ? "/" : normalized;
}

function normalizeDocsPrefix(value: string): string {
  return stripLeadingSlash(value).replace(/\/+$/, "");
}

function joinRoutes(prefix: string, remainder: string): string {
  const normalizedPrefix = normalizeRoutePrefix(prefix);
  const cleanRemainder = stripLeadingSlash(remainder).replace(/\/+$/, "");

  if (!cleanRemainder) {
    return normalizedPrefix;
  }

  return `${normalizedPrefix === "/" ? "" : normalizedPrefix}/${cleanRemainder}`;
}

function stripLeadingSlash(value: string): string {
  return value.replace(/^\/+/, "");
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
