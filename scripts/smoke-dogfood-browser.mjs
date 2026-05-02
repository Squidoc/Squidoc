import { spawn } from "node:child_process";
import { once } from "node:events";
import { join } from "node:path";
import { chromium } from "playwright";

const repoRoot = new URL("..", import.meta.url).pathname;
const docsRoot = join(repoRoot, "examples/squidoc-docs");
const port = process.env.SQUIDOC_BROWSER_SMOKE_PORT ?? "4397";
const baseUrl = `http://127.0.0.1:${port}`;
const server = spawn(
  process.execPath,
  [
    join(repoRoot, "packages/squidoc/dist/cli.js"),
    "preview",
    "--",
    "--host",
    "127.0.0.1",
    "--port",
    port,
  ],
  {
    cwd: docsRoot,
    detached: true,
    env: {
      ...process.env,
      ASTRO_TELEMETRY_DISABLED: "1",
    },
    stdio: ["ignore", "pipe", "pipe"],
  },
);

let serverOutput = "";
server.stdout.on("data", (chunk) => {
  serverOutput += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  serverOutput += chunk.toString();
});

try {
  await waitForServer();

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.setViewportSize({ width: 1200, height: 720 });
    await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
    await expectText(page.locator("main h1"), "Docs that start simple and grow with your product.");
    await expectAttribute(page.locator(".sq-home__primary"), "href", "/docs/getting-started");
    await expectAttribute(page.locator(".sq-topbar__logo"), "src", "/squidoc-logo.svg");
    await expectMobileTopbarLinks(page);
    await expectNarrowDocsLayout(page);

    await page.goto(`${baseUrl}/docs/developers`, { waitUntil: "networkidle" });
    await expectFooterNotAboveViewport(page);
    await expectFooterSpansToViewportRight(page);
    await expectSidebarFillsViewport(page);

    await page.goto(`${baseUrl}/docs/configuration`, { waitUntil: "networkidle" });
    await expectText(page.locator("main h1"), "Configuration");
    await expectAttribute(
      page.locator('link[rel="canonical"]'),
      "href",
      "https://squidoc.com/docs/configuration",
    );
    await expectText(page.locator(".sq-locale-selector__label"), "Language");
    await expectAttribute(
      page.locator('link[rel="alternate"][hreflang="es"]'),
      "href",
      "https://squidoc.com/es/docs/configuration",
    );
    await assertMinCount(page.locator("[data-squidoc-codeblock]"), 2);
    await assertMinCount(page.locator("[data-squidoc-copy-code]"), 2);
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          async writeText(text) {
            window.__squidocCopiedText = text;
          },
        },
      });
    });
    await page.reload({ waitUntil: "networkidle" });
    await page.locator("[data-squidoc-copy-code]").first().click();
    await expectTextEventually(page.locator("[data-squidoc-copy-code]").first(), "Copied");

    await page.locator("#squidoc-locale-selector").selectOption("es");
    await page.waitForURL(`${baseUrl}/es/docs/configuration`, { waitUntil: "networkidle" });
    await expectAttribute(page.locator("html"), "lang", "es");
    await expectText(page.locator("main h1"), "Configuración");
    await page.locator("#squidoc-version-selector").selectOption("/es/docs/versions/0.1");
    await page.waitForURL(`${baseUrl}/es/docs/versions/0.1/configuration`, {
      waitUntil: "networkidle",
    });
    await expectText(page.locator("main h1"), "Configuración");
    await page.locator("#squidoc-version-selector").selectOption("/es/docs");
    await page.waitForURL(`${baseUrl}/es/docs/configuration`, { waitUntil: "networkidle" });
    await page.locator("#squidoc-search-input").fill("fuente principal");
    await expectText(
      page.locator('.sq-search__result[href="/es/docs/configuration"] .sq-search__result-title'),
      "Configuración\nNext",
    );
    await page.locator("#squidoc-locale-selector").selectOption("en");
    await page.waitForURL(`${baseUrl}/docs/configuration`, { waitUntil: "networkidle" });

    await page.goto(`${baseUrl}/docs/pages`, { waitUntil: "networkidle" });
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expectTextEventually(page.locator(".sq-article-tree__link[data-active]"), "Limits");

    await page.goto(`${baseUrl}/docs/versioning`, { waitUntil: "networkidle" });
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expectTextEventually(
      page.locator(".sq-article-tree__link[data-active]"),
      "Planning for languages",
    );
    await page.evaluate(() => window.scrollBy(0, -260));
    await expectTextEventually(
      page.locator(".sq-article-tree__link[data-active]"),
      "Search Behavior",
    );

    await page.goto(`${baseUrl}/docs/configuration`, { waitUntil: "networkidle" });
    await expectText(page.locator(".sq-version-selector__label"), "Version");
    await page.locator("#squidoc-version-selector").selectOption("/docs/versions/0.1");
    await page.waitForURL(`${baseUrl}/docs/versions/0.1/configuration`, {
      waitUntil: "networkidle",
    });
    await expectText(page.locator("main h1"), "Configuration");
    await expectAttribute(
      page.locator('nav[aria-label="Documentation"] a').filter({ hasText: "Plugin Authoring" }),
      "href",
      "/docs/versions/0.1/plugin-authoring",
    );
    assert(
      (await page
        .locator('nav[aria-label="Documentation"] summary')
        .filter({ hasText: "Versions" })
        .count()) === 0,
      "Archived docs should not render a redundant Versions nav folder.",
    );
    await page.locator("#squidoc-search-input").fill("production deployment");
    await expectText(
      page.locator(
        '.sq-search__result[href="/docs/versions/0.1/deployment"] .sq-search__result-version',
      ),
      "0.1",
    );
    await page.locator("#squidoc-version-selector").selectOption("/docs");
    await page.waitForURL(`${baseUrl}/docs/configuration`, { waitUntil: "networkidle" });

    await page.locator("#squidoc-search-input").fill("production deployment");
    await expectText(
      page.locator('.sq-search__result[href="/docs/deployment"] .sq-search__result-title'),
      "Deployment\nNext",
    );
    await expectText(
      page.locator('.sq-search__result[href="/docs/deployment"] .sq-search__result-version'),
      "Next",
    );
    await expectText(
      page.locator('.sq-search__result[href="/docs/deployment"] .sq-search__result-description'),
      "Deploy a Squidoc site to production on Vercel, Netlify, Cloudflare Pages, GitHub Pages, Docker, and static hosts.",
    );

    await page.locator("#squidoc-search-input").fill("zzzz-no-match");
    await expectText(page.locator(".sq-search__empty"), "No results found.");

    await page.goto(`${baseUrl}/search-index.json`, { waitUntil: "networkidle" });
    const searchIndex = JSON.parse(await page.locator("body").innerText());
    assert(
      searchIndex.some(
        (entry) => entry.route === "/docs/configuration" && entry.version?.label === "Next",
      ),
      "search-index.json should include current version metadata",
    );
    assert(
      searchIndex.some(
        (entry) =>
          entry.route === "/docs/versions/0.1/configuration" && entry.version?.label === "0.1",
      ),
      "search-index.json should include archived version metadata",
    );
    assert(
      searchIndex.some(
        (entry) =>
          entry.route === "/es/docs/configuration" &&
          entry.locale?.code === "es" &&
          entry.version?.label === "Next",
      ),
      "search-index.json should include locale metadata",
    );
  } finally {
    await browser.close();
  }

  console.log("Dogfood browser smoke passed.");
} finally {
  stopServer();
  await Promise.race([
    once(server, "exit").catch(() => {}),
    new Promise((resolve) => setTimeout(resolve, 1_000)),
  ]);
}

function stopServer() {
  if (!server.pid) {
    return;
  }

  try {
    process.kill(-server.pid, "SIGTERM");
  } catch {
    server.kill();
  }
}

async function waitForServer() {
  const started = Date.now();

  while (Date.now() - started < 20_000) {
    if (server.exitCode !== null) {
      throw new Error(`Preview exited early.\n${serverOutput}`);
    }

    try {
      const response = await fetch(baseUrl);

      if (response.ok) {
        return;
      }
    } catch {
      // Keep waiting until the preview server opens the port.
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error(`Timed out waiting for preview server.\n${serverOutput}`);
}

async function expectText(locator, expected) {
  const actual = (await locator.innerText()).trim();
  assert(actual === expected, `Expected text "${expected}", received "${actual}".`);
}

async function expectTextEventually(locator, expected) {
  const started = Date.now();
  let actual = "";

  while (Date.now() - started < 2_000) {
    actual = (await locator.innerText()).trim();

    if (actual === expected) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  assert(false, `Expected text "${expected}", received "${actual}".`);
}

async function expectAttribute(locator, name, expected) {
  const actual = await locator.getAttribute(name);
  assert(actual === expected, `Expected ${name}="${expected}", received "${actual}".`);
}

async function assertMinCount(locator, expected) {
  const actual = await locator.count();
  assert(actual >= expected, `Expected at least ${expected} matches, received ${actual}.`);
}

async function expectFooterNotAboveViewport(page) {
  const footerBox = await page.locator(".sq-footer").boundingBox();
  const viewport = page.viewportSize();

  assert(footerBox, "Expected footer to be visible.");
  assert(viewport, "Expected a viewport size.");
  assert(
    footerBox.y + footerBox.height >= viewport.height - 2,
    "Expected footer to sit at or below the viewport bottom.",
  );
}

async function expectSidebarFillsViewport(page) {
  const sidebarBox = await page.locator(".sq-sidebar").boundingBox();
  const viewport = page.viewportSize();

  assert(sidebarBox, "Expected sidebar to be visible.");
  assert(viewport, "Expected a viewport size.");
  assert(
    Math.abs(sidebarBox.height - (viewport.height - 60)) <= 2,
    "Expected sidebar to fill the available viewport height below the navbar.",
  );
}

async function expectFooterSpansToViewportRight(page) {
  const footerBox = await page.locator(".sq-footer").boundingBox();
  const viewport = page.viewportSize();

  assert(footerBox, "Expected footer to be visible.");
  assert(viewport, "Expected a viewport size.");
  assert(
    Math.abs(footerBox.x + footerBox.width - viewport.width) <= 2,
    "Expected footer to extend to the right edge of the viewport.",
  );
}

async function expectMobileTopbarLinks(page) {
  await page.setViewportSize({ width: 390, height: 780 });
  await page.reload({ waitUntil: "networkidle" });
  await expectHidden(page.locator(".sq-topbar__nav"));
  await page.locator(".sq-sidebar-toggle").click();
  await expectVisible(page.locator(".sq-topbar__nav"));
  await expectAttribute(
    page.locator(".sq-topbar__nav a").filter({ hasText: "Docs" }),
    "href",
    "/docs",
  );
  await page.setViewportSize({ width: 1200, height: 720 });
  await page.reload({ waitUntil: "networkidle" });
}

async function expectNarrowDocsLayout(page) {
  await page.setViewportSize({ width: 763, height: 780 });
  await page.goto(`${baseUrl}/docs/versioning`, { waitUntil: "networkidle" });
  await expectVisible(page.locator(".sq-sidebar-toggle"));
  await expectHidden(page.locator(".sq-topbar__nav"));
  await expectHidden(page.locator(".sq-article-tree"));
  await page.setViewportSize({ width: 1200, height: 720 });
  await page.reload({ waitUntil: "networkidle" });
}

async function expectHidden(locator) {
  assert(!(await locator.isVisible()), "Expected element to be hidden.");
}

async function expectVisible(locator) {
  assert(await locator.isVisible(), "Expected element to be visible.");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
