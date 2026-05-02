import type { DocPage } from "./docs.js";
import type { NavAutogenerate, NavConfig, NavConfigItem, NavItem } from "./schema.js";

type NavTreeNode = {
  segment: string;
  path: string;
  page?: DocPage;
  children: Map<string, NavTreeNode>;
};

type SortableNavItem = NavItem & {
  _index?: boolean;
  _order?: number;
  _sortTitle?: string;
};

const DEFAULT_AUTOGENERATE: NavAutogenerate = {
  from: "/",
  exclude: [],
  generatedPosition: "before",
};

export function resolveNavConfig(nav: NavConfig, pages: DocPage[]): NavItem[] {
  if (nav === "auto") {
    return generateNav(pages, DEFAULT_AUTOGENERATE, true);
  }

  if (!Array.isArray(nav)) {
    return generateNav(pages, nav.autogenerate, true);
  }

  return nav.flatMap((item) => resolveNavItem(item, pages));
}

function resolveNavItem(item: NavConfigItem, pages: DocPage[]): NavItem[] {
  if (!("autogenerate" in item) || !item.autogenerate) {
    return [
      {
        title: item.title,
        path: item.path,
        items: item.items?.flatMap((child) => resolveNavItem(child, pages)),
      },
    ];
  }

  const generated = generateNav(pages, item.autogenerate, false);
  const manualChildren = item.items?.flatMap((child) => resolveNavItem(child, pages)) ?? [];
  const children =
    item.autogenerate.generatedPosition === "after"
      ? [...manualChildren, ...generated]
      : [...generated, ...manualChildren];

  return [
    {
      title: item.title,
      path: item.path ?? findPageForRoute(pages, item.autogenerate.from)?.docsRoute,
      items: children.length > 0 ? children : undefined,
    },
  ];
}

function generateNav(
  pages: DocPage[],
  options: NavAutogenerate,
  includeRootPage: boolean,
): NavItem[] {
  const from = normalizeRoute(options.from);
  const root = createNode("", "/");
  const pageByRoute = new Map(pages.map((page) => [page.docsRoute, page]));
  const hiddenChildrenRoutes = pages
    .filter((page) => isHidden(page) && shouldHideChildren(page))
    .map((page) => page.docsRoute);

  for (const page of pages) {
    if (
      shouldSkipHiddenSubtree(page.docsRoute, hiddenChildrenRoutes) ||
      !isWithinRoute(page.docsRoute, from) ||
      isExcluded(page.docsRoute, options.exclude)
    ) {
      continue;
    }

    const relative = relativeRoute(page.docsRoute, from);
    const segments = relative === "" ? [] : relative.split("/");
    let node = root;

    if (segments.length === 0) {
      node.page = page;
      continue;
    }

    for (let index = 0; index < segments.length; index += 1) {
      const segment = segments[index] ?? "";
      const path = joinRoutes(from, segments.slice(0, index + 1).join("/"));
      const child = node.children.get(segment) ?? createNode(segment, path);

      node.children.set(segment, child);
      node = child;
    }

    node.page = page;
  }

  const items = [...root.children.values()]
    .map((node) => toNavItem(node, pageByRoute))
    .filter((item): item is SortableNavItem => Boolean(item))
    .sort(compareNavItems);

  if (includeRootPage && root.page && !isHidden(root.page)) {
    items.unshift({
      title: titleForPage(root.page),
      path: root.page.docsRoute,
      _index: true,
      _order: readNavOrder(root.page),
      _sortTitle: titleForPage(root.page),
    });
  }

  return items.map(cleanNavItem);
}

function toNavItem(
  node: NavTreeNode,
  pageByRoute: Map<string, DocPage>,
): SortableNavItem | undefined {
  const children = [...node.children.values()]
    .map((child) => toNavItem(child, pageByRoute))
    .filter((item): item is SortableNavItem => Boolean(item))
    .sort(compareNavItems)
    .map(cleanNavItem);
  const page = node.page ?? pageByRoute.get(node.path);

  if ((!page || isHidden(page)) && children.length === 0) {
    return undefined;
  }

  return {
    title: page ? titleForPage(page) : titleFromSegment(node.segment),
    path: page && !isHidden(page) ? page.docsRoute : undefined,
    items: children.length > 0 ? children : undefined,
    _index: node.path === page?.docsRoute,
    _order: readNavOrder(page),
    _sortTitle: page ? titleForPage(page) : titleFromSegment(node.segment),
  };
}

function cleanNavItem(item: SortableNavItem): NavItem {
  const { _index, _order, _sortTitle, items, path, ...clean } = item;
  return {
    ...clean,
    ...(path ? { path } : {}),
    ...(items && items.length > 0 ? { items } : {}),
  };
}

function compareNavItems(first: SortableNavItem, second: SortableNavItem): number {
  const firstOrder = first._order ?? Number.POSITIVE_INFINITY;
  const secondOrder = second._order ?? Number.POSITIVE_INFINITY;

  if (firstOrder !== secondOrder) {
    return firstOrder - secondOrder;
  }

  if (first._index !== second._index) {
    return first._index ? -1 : 1;
  }

  return (first._sortTitle ?? first.title).localeCompare(second._sortTitle ?? second.title);
}

function createNode(segment: string, path: string): NavTreeNode {
  return { segment, path, children: new Map() };
}

function findPageForRoute(pages: DocPage[], route: string): DocPage | undefined {
  const normalized = normalizeRoute(route);
  return pages.find((page) => page.docsRoute === normalized);
}

function isWithinRoute(route: string, parent: string): boolean {
  return parent === "/" || route === parent || route.startsWith(`${parent}/`);
}

function relativeRoute(route: string, parent: string): string {
  if (parent === "/") {
    return stripLeadingSlash(route);
  }

  return route.slice(parent.length).replace(/^\/+/, "");
}

function isExcluded(route: string, patterns: string[]): boolean {
  const value = stripLeadingSlash(route);

  return patterns.some((pattern) => matchesPattern(value, pattern));
}

function matchesPattern(value: string, pattern: string): boolean {
  const normalized = stripLeadingSlash(pattern).replace(/\/+$/, "");

  if (normalized.endsWith("/**")) {
    const prefix = normalized.slice(0, -3);
    return value === prefix || value.startsWith(`${prefix}/`);
  }

  if (normalized.endsWith("/*")) {
    const prefix = normalized.slice(0, -2);
    return value.startsWith(`${prefix}/`) && !value.slice(prefix.length + 1).includes("/");
  }

  return value === normalized;
}

function titleForPage(page: DocPage): string {
  return readString(readNavConfig(page)?.title) ?? stripNumericPrefix(page.title);
}

function titleFromSegment(segment: string): string {
  return stripNumericPrefix(segment)
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function stripNumericPrefix(value: string): string {
  return value.replace(/^\d+[-_.\s]+/, "");
}

function isHidden(page: DocPage): boolean {
  return readNavConfig(page)?.hidden === true;
}

function shouldHideChildren(page: DocPage): boolean {
  return readNavConfig(page)?.hideChildren === true;
}

function shouldSkipHiddenSubtree(route: string, hiddenChildrenRoutes: string[]): boolean {
  return hiddenChildrenRoutes.some((hiddenRoute) => isWithinRoute(route, hiddenRoute));
}

function readNavOrder(page: DocPage | undefined): number | undefined {
  const order = page ? readNavConfig(page)?.order : undefined;
  return typeof order === "number" && Number.isFinite(order) ? order : undefined;
}

function readNavConfig(page: DocPage): Record<string, unknown> | undefined {
  const nav = page.frontmatter.nav;
  return typeof nav === "object" && nav !== null && !Array.isArray(nav)
    ? (nav as Record<string, unknown>)
    : undefined;
}

function joinRoutes(prefix: string, remainder: string): string {
  const normalizedPrefix = normalizeRoute(prefix);
  const cleanRemainder = stripLeadingSlash(remainder).replace(/\/+$/, "");

  if (!cleanRemainder) {
    return normalizedPrefix;
  }

  return `${normalizedPrefix === "/" ? "" : normalizedPrefix}/${cleanRemainder}`;
}

function normalizeRoute(value: string): string {
  const prefixed = value.startsWith("/") ? value : `/${value}`;
  const withoutTrailingSlash = prefixed.replace(/\/+$/, "");

  return withoutTrailingSlash === "" ? "/" : withoutTrailingSlash;
}

function stripLeadingSlash(value: string): string {
  return value.replace(/^\/+/, "");
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}
