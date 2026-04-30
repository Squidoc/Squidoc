import type { DocPage, ResolvedSquidocConfig } from "@squidoc/core";

const MARKDOWN_LINK_PATTERN = /\[[^\]]+\]\(([^)]+)\)/g;

export type CheckIssue = {
  message: string;
};

export function validateProject(config: ResolvedSquidocConfig, pages: DocPage[]): CheckIssue[] {
  const issues: CheckIssue[] = [];

  if (pages.length === 0) {
    issues.push({ message: `No documentation pages found in ${config.docsDir}.` });
    return issues;
  }

  issues.push(...validateNavRoutes(config, pages), ...validateMarkdownLinks(pages));

  return issues;
}

function validateNavRoutes(config: ResolvedSquidocConfig, pages: DocPage[]): CheckIssue[] {
  const routes = new Set(pages.map((page) => page.route));

  return config.nav
    .filter((item) => !routes.has(item.path))
    .map((item) => ({ message: `Navigation references missing route: ${item.path}` }));
}

function validateMarkdownLinks(pages: DocPage[]): CheckIssue[] {
  const routes = new Set(pages.map((page) => page.route));
  const issues: CheckIssue[] = [];

  for (const page of pages) {
    for (const link of page.content.matchAll(MARKDOWN_LINK_PATTERN)) {
      const href = link[1]?.trim();

      if (!href || isExternalLink(href) || href.startsWith("#")) {
        continue;
      }

      const route = normalizeInternalHref(href, page.route);

      if (route && !routes.has(route)) {
        issues.push({
          message: `${page.route} links to missing route: ${href}`,
        });
      }
    }
  }

  return issues;
}

function isExternalLink(href: string): boolean {
  return /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("//");
}

function normalizeInternalHref(href: string, currentRoute: string): string {
  const withoutHash = href.split("#")[0] ?? "";
  const withoutQuery = withoutHash.split("?")[0] ?? "";

  if (withoutQuery === "") {
    return "";
  }

  if (withoutQuery.startsWith("/")) {
    return normalizeRoute(withoutQuery);
  }

  const currentSegments = currentRoute === "/" ? [] : currentRoute.slice(1).split("/");
  const baseSegments = currentSegments.slice(0, -1);

  for (const segment of withoutQuery.split("/")) {
    if (!segment || segment === ".") {
      continue;
    }

    if (segment === "..") {
      baseSegments.pop();
      continue;
    }

    baseSegments.push(segment);
  }

  return normalizeRoute(`/${baseSegments.join("/")}`);
}

function normalizeRoute(route: string): string {
  const withoutTrailingSlash = route.replace(/\/index$/, "").replace(/\/+$/, "");
  return withoutTrailingSlash === "" ? "/" : withoutTrailingSlash;
}
