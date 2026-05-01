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
};

export default definePlugin({
  name: "@squidoc/plugin-versions",
  setup(api) {
    const versions = resolveVersions(api.pluginOptions);

    api.addProjectTransformer((project) => {
      const pages = project.pages.map((page) => transformPage(page, versions));
      const nav = appendVersionsNav(project.nav, versions);

      return { pages, nav };
    });

    api.addGeneratedFile({
      path: "versions.json",
      contents: `${JSON.stringify(toManifest(versions), null, 2)}\n`,
    });

    api.addThemeSlot({
      name: "version-selector",
      component: "@squidoc/plugin-versions/VersionSelector.astro",
      html: renderVersionSelector(versions),
    });
  },
});

function resolveVersions(options: Record<string, unknown>): ResolvedVersion[] {
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
      routePrefix: normalizeRoutePrefix(current.routePrefix ?? "/"),
      docsPrefix: current.docsPrefix,
      current: true,
    },
    ...archived.map((version) => ({
      name: version.name,
      label: version.label ?? version.name,
      routePrefix: normalizeRoutePrefix(version.routePrefix ?? `/versions/${version.name}`),
      docsPrefix: normalizeDocsPrefix(version.docsPrefix ?? `versions/${version.name}`),
      current: false,
    })),
  ];
}

function transformPage(page: DocPage, versions: ResolvedVersion[]): DocPage {
  const matched = findVersionForPage(page, versions);

  if (!matched) {
    return page;
  }

  return {
    ...page,
    route: matched.route,
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
  const sourceRoute = stripLeadingSlash(page.route);

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

function appendVersionsNav(nav: NavItem[], versions: ResolvedVersion[]): NavItem[] {
  if (versions.length <= 1 || nav.some((item) => item.title === "Versions")) {
    return nav;
  }

  return [
    ...nav,
    {
      title: "Versions",
      items: versions.map((version) => ({
        title: version.label,
        path: version.routePrefix,
      })),
    },
  ];
}

function renderVersionSelector(versions: ResolvedVersion[]): string {
  if (versions.length <= 1) {
    return "";
  }

  const options = versions
    .map(
      (version) =>
        `<option value="${escapeHtml(version.routePrefix)}">${escapeHtml(version.label)}</option>`,
    )
    .join("");
  const manifest = JSON.stringify(toManifest(versions));

  return `<div class="sq-version-selector" data-squidoc-versions data-versions="${escapeHtml(
    manifest,
  )}">
  <label class="sq-version-selector__label" for="squidoc-version-selector">Version</label>
  <select class="sq-version-selector__select" id="squidoc-version-selector" aria-label="Documentation version">
    ${options}
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
  const active = versions
    .filter((version) => version.routePrefix !== "/")
    .find((version) => path === version.routePrefix || path.startsWith(version.routePrefix.replace(/\\/+$/, "") + "/")) ?? versions.find((version) => version.routePrefix === "/" && path === "/") ?? versions.find((version) => version.current);

  if (active) {
    select.value = active.routePrefix;
  }

  select.addEventListener("change", () => {
    const target = versions.find((version) => version.routePrefix === select.value);

    if (!target || !active) {
      return;
    }

    const relative = path === active.routePrefix ? "" : path.slice(active.routePrefix.length).replace(/^\\/+/, "");
    const nextPath = [target.routePrefix.replace(/\\/+$/, ""), relative].filter(Boolean).join("/");
    window.location.href = nextPath.startsWith("/") ? nextPath : "/" + nextPath;
  });
})();
</script>`;
}

function toManifest(versions: ResolvedVersion[]): VersionManifestEntry[] {
  return versions.map(({ name, label, routePrefix, current }) => ({
    name,
    label,
    routePrefix,
    current,
  }));
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
