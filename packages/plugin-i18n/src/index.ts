import { type DocPage, type NavItem, definePlugin } from "@squidoc/core";

export type I18nOptions = {
  defaultLocale?: string;
  locales?: LocaleConfig[];
};

type LocaleConfig = {
  code: string;
  label?: string;
};

type ResolvedLocale = {
  code: string;
  label: string;
  routePrefix: string;
  current: boolean;
};

type VersionConfig = {
  name: string;
  label?: string;
  routePrefix?: string;
  docsPrefix?: string;
  current: boolean;
};

type PageLocale = {
  locale: ResolvedLocale;
  docsRoute: string;
};

type LocaleManifestEntry = {
  code: string;
  label: string;
  routePrefix: string;
  current: boolean;
  routes: string[];
};

const LOCALE_CODE_PATTERN = /^[a-z]{2,3}(?:-[A-Z]{2})?$/;

export default definePlugin({
  name: "@squidoc/plugin-i18n",
  setup(api) {
    warnForPluginOrder(api.config.plugins);
    const locales = resolveLocales(api.pluginOptions);
    const versions = resolveVersionsFromConfig(api.config.plugins, api.config.docs.basePath);

    if (locales.length <= 1) {
      return;
    }

    api.addProjectTransformer((project) => {
      const routeSet = new Set(
        project.pages.map((page) =>
          routeForPage(page, locales, versions, api.config.docs.basePath),
        ),
      );
      const pages = project.pages.map((page) =>
        transformPage(page, locales, versions, project.nav, api.config.docs.basePath, routeSet),
      );

      return { pages, nav: project.nav };
    });

    api.addGeneratedFile({
      path: "locales.json",
      contents: `${JSON.stringify(toManifest(locales, api.pages), null, 2)}\n`,
    });

    api.addThemeSlot({
      name: "locale-selector",
      component: "@squidoc/plugin-i18n/LocaleSelector.astro",
      html: renderLocaleSelector(locales, api.pages),
    });
  },
});

function transformPage(
  page: DocPage,
  locales: ResolvedLocale[],
  versions: VersionConfig[],
  nav: NavItem[],
  docsBasePath: string,
  routeSet: Set<string>,
): DocPage {
  const parsed = parsePageLocale(page.docsRoute, locales);
  const version = findVersion(parsed.docsRoute, versions);
  const remainder = version
    ? stripDocsPrefix(parsed.docsRoute, version.docsPrefix ?? "")
    : stripLeadingSlash(parsed.docsRoute);
  const versionRoutePrefix = joinRoutes(
    parsed.locale.routePrefix,
    version?.routePrefix ?? docsBasePath,
  );
  const route = joinRoutes(versionRoutePrefix, remainder);

  return {
    ...page,
    route,
    nav: rewriteNav(nav, versionRoutePrefix, routeSet),
    frontmatter: {
      ...page.frontmatter,
      squidocLocale: parsed.locale.code,
      squidocLocaleLabel: parsed.locale.label,
      squidocLocaleRoutePrefix: parsed.locale.routePrefix,
      squidocLocaleCurrent: parsed.locale.current,
      squidocI18nBaseRoute: parsed.docsRoute,
      ...(version
        ? {
            squidocVersion: version.name,
            squidocVersionLabel: version.label ?? version.name,
            squidocVersionRoutePrefix: versionRoutePrefix,
            squidocVersionCurrent: version.current,
          }
        : {}),
    },
  };
}

function routeForPage(
  page: DocPage,
  locales: ResolvedLocale[],
  versions: VersionConfig[],
  docsBasePath: string,
): string {
  const parsed = parsePageLocale(page.docsRoute, locales);
  const version = findVersion(parsed.docsRoute, versions);
  const remainder = version
    ? stripDocsPrefix(parsed.docsRoute, version.docsPrefix ?? "")
    : stripLeadingSlash(parsed.docsRoute);
  const versionRoutePrefix = joinRoutes(
    parsed.locale.routePrefix,
    version?.routePrefix ?? docsBasePath,
  );

  return joinRoutes(versionRoutePrefix, remainder);
}

function parsePageLocale(docsRoute: string, locales: ResolvedLocale[]): PageLocale {
  const defaultLocale = locales.find((locale) => locale.current) ?? locales[0];
  const segments = stripLeadingSlash(docsRoute).split("/").filter(Boolean);
  const locale = locales.find((item) => !item.current && item.code === segments[0]);

  if (!defaultLocale) {
    throw new Error("@squidoc/plugin-i18n requires at least one locale.");
  }

  if (!locale) {
    return { locale: defaultLocale, docsRoute };
  }

  const withoutLocale = `/${segments.slice(1).join("/")}`.replace(/\/+$/, "");

  return {
    locale,
    docsRoute: withoutLocale === "" ? "/" : withoutLocale,
  };
}

function findVersion(docsRoute: string, versions: VersionConfig[]): VersionConfig | undefined {
  const sourceRoute = stripLeadingSlash(docsRoute);
  const archived = versions.filter((version) => !version.current);

  for (const version of archived) {
    const docsPrefix = normalizeDocsPrefix(version.docsPrefix ?? `versions/${version.name}`);

    if (sourceRoute === docsPrefix || sourceRoute.startsWith(`${docsPrefix}/`)) {
      return { ...version, docsPrefix };
    }
  }

  return versions.find((version) => version.current);
}

function stripDocsPrefix(docsRoute: string, docsPrefix: string): string {
  const sourceRoute = stripLeadingSlash(docsRoute);
  const normalizedPrefix = normalizeDocsPrefix(docsPrefix);

  if (!normalizedPrefix) {
    return sourceRoute;
  }

  return sourceRoute.slice(normalizedPrefix.length).replace(/^\/+/, "");
}

function rewriteNav(items: NavItem[], routePrefix: string, routeSet: Set<string>): NavItem[] {
  return items.flatMap((item) => {
    const path = item.path ? joinRoutes(routePrefix, item.path) : undefined;
    const children = item.items ? rewriteNav(item.items, routePrefix, routeSet) : undefined;
    const hasPath = path ? routeSet.has(path) : false;
    const nextItem = {
      ...item,
      path: hasPath ? path : undefined,
      items: children && children.length > 0 ? children : undefined,
    };

    return nextItem.path || nextItem.items ? [nextItem] : [];
  });
}

function renderLocaleSelector(locales: ResolvedLocale[], pages: DocPage[]): string {
  const options = locales
    .map(
      (locale) =>
        `<option value="${escapeHtml(locale.code)}"${locale.current ? " selected" : ""}>${escapeHtml(locale.label)}</option>`,
    )
    .join("");
  const manifest = JSON.stringify(toManifest(locales, pages));

  return `<div class="sq-locale-selector" data-squidoc-locales data-locales="${escapeHtml(
    manifest,
  )}">
  <label class="sq-locale-selector__label" for="squidoc-locale-selector">Language</label>
  <select class="sq-locale-selector__select" id="squidoc-locale-selector" aria-label="Documentation language">
    ${options}
  </select>
</div>
<script type="module">
(() => {
  const root = document.querySelector("[data-squidoc-locales]");
  const select = document.querySelector("#squidoc-locale-selector");

  if (!(root instanceof HTMLElement) || !(select instanceof HTMLSelectElement)) {
    return;
  }

  const locales = JSON.parse(root.dataset.locales ?? "[]");
  const path = window.location.pathname.replace(/\\/+$/, "") || "/";
  const active = resolveActiveLocale(locales, path);

  if (active) {
    select.value = active.code;
  }

  select.addEventListener("change", () => {
    const target = locales.find((locale) => locale.code === select.value);

    if (!target || !active) {
      return;
    }

    const relative = path === active.routePrefix ? "" : path.slice(active.routePrefix.length).replace(/^\\/+/, "");
    const candidate = [target.routePrefix.replace(/\\/+$/, ""), relative].filter(Boolean).join("/");
    const nextPath = target.routes.includes(candidate.startsWith("/") ? candidate : "/" + candidate)
      ? candidate
      : target.routes[0] ?? target.routePrefix;
    window.location.href = nextPath.startsWith("/") ? nextPath : "/" + nextPath;
  });

  function resolveActiveLocale(locales, path) {
    return locales
      .filter((locale) => locale.routePrefix !== "/")
      .sort((first, second) => second.routePrefix.length - first.routePrefix.length)
      .find((locale) => path === locale.routePrefix || path.startsWith(locale.routePrefix.replace(/\\/+$/, "") + "/"))
      ?? locales.find((locale) => locale.current)
      ?? locales[0];
  }
})();
</script>`;
}

function toManifest(locales: ResolvedLocale[], pages: DocPage[]): LocaleManifestEntry[] {
  return locales.map((locale) => ({
    code: locale.code,
    label: locale.label,
    routePrefix: locale.routePrefix,
    current: locale.current,
    routes: pages
      .filter((page) => page.frontmatter.squidocLocale === locale.code)
      .map((page) => page.route)
      .sort(),
  }));
}

function resolveLocales(options: Record<string, unknown>): ResolvedLocale[] {
  const defaultLocale = readString(options.defaultLocale) ?? "en";
  validateLocaleCode(defaultLocale, "defaultLocale");
  const configuredLocales = Array.isArray(options.locales)
    ? options.locales.flatMap((locale) => {
        const config = readLocaleConfig(locale);
        return config ? [config] : [];
      })
    : [];
  const locales =
    configuredLocales.length > 0 ? configuredLocales : [{ code: defaultLocale, label: "English" }];
  const withDefault = locales.some((locale) => locale.code === defaultLocale)
    ? locales
    : [{ code: defaultLocale, label: defaultLocale }, ...locales];

  return withDefault.map((locale) => ({
    code: locale.code,
    label: locale.label ?? locale.code,
    routePrefix: locale.code === defaultLocale ? "/" : normalizeRoutePrefix(`/${locale.code}`),
    current: locale.code === defaultLocale,
  }));
}

function warnForPluginOrder(
  plugins: Array<string | { name: string; options: Record<string, unknown> }>,
): void {
  const i18nIndex = plugins.findIndex((plugin) => getPluginName(plugin) === "@squidoc/plugin-i18n");
  const versionsIndex = plugins.findIndex(
    (plugin) => getPluginName(plugin) === "@squidoc/plugin-versions",
  );

  if (i18nIndex >= 0 && versionsIndex >= 0 && i18nIndex < versionsIndex) {
    console.warn(
      "@squidoc/plugin-i18n should be listed after @squidoc/plugin-versions so localized version routes compose correctly.",
    );
  }
}

function getPluginName(
  plugin: string | { name: string; options: Record<string, unknown> },
): string {
  return typeof plugin === "string" ? plugin : plugin.name;
}

function resolveVersionsFromConfig(
  plugins: Array<string | { name: string; options: Record<string, unknown> }>,
  docsBasePath: string,
): VersionConfig[] {
  const plugin = plugins.find(
    (item) => typeof item !== "string" && item.name === "@squidoc/plugin-versions",
  );
  const options = typeof plugin === "string" || !plugin ? {} : plugin.options;
  const current = readVersionConfig(options.current, true) ?? {
    name: "current",
    label: "Current",
    routePrefix: docsBasePath,
    current: true,
  };
  const archived = Array.isArray(options.versions)
    ? options.versions.flatMap((version) => {
        const config = readVersionConfig(version, false);
        return config ? [config] : [];
      })
    : [];

  return [
    {
      ...current,
      routePrefix: normalizeRoutePrefix(current.routePrefix ?? docsBasePath),
      docsPrefix: current.docsPrefix,
      current: true,
    },
    ...archived.map((version) => ({
      ...version,
      routePrefix: normalizeRoutePrefix(
        version.routePrefix ?? joinRoutes(docsBasePath, `/versions/${version.name}`),
      ),
      docsPrefix: normalizeDocsPrefix(version.docsPrefix ?? `versions/${version.name}`),
      current: false,
    })),
  ];
}

function readLocaleConfig(value: unknown): LocaleConfig | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const code = readString(value.code);

  if (!code) {
    return undefined;
  }

  validateLocaleCode(code, "locale code");

  return { code, label: readString(value.label) };
}

function validateLocaleCode(code: string, label: string): void {
  if (!LOCALE_CODE_PATTERN.test(code)) {
    throw new Error(
      `@squidoc/plugin-i18n received invalid ${label} "${code}". Use BCP 47-style codes like "en", "es", or "pt-BR".`,
    );
  }
}

function readVersionConfig(value: unknown, current: boolean): VersionConfig | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const name = readString(value.name);

  return name
    ? {
        name,
        label: readString(value.label),
        routePrefix: readString(value.routePrefix),
        docsPrefix: readString(value.docsPrefix),
        current,
      }
    : undefined;
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
