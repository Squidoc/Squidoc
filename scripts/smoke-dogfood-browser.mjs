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
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await expectFooterPinnedToViewport(page);
    await expectSidebarFillsViewport(page);

    await page.goto(`${baseUrl}/configuration`, { waitUntil: "networkidle" });
    await expectText(page.locator("main h1"), "Configuration");
    await expectAttribute(
      page.locator('link[rel="canonical"]'),
      "href",
      "https://squidoc.dev/configuration",
    );
    await assertCount(page.locator("[data-squidoc-codeblock]"), 2);
    await assertCount(page.locator("[data-squidoc-copy-code]"), 2);
    await page.locator("[data-squidoc-copy-code]").first().click();
    await expectText(page.locator("[data-squidoc-copy-code]").first(), "Copied");

    await page.locator("#squidoc-search-input").fill("generated output");
    await expectText(
      page.locator('.sq-search__result[href="/testing"]'),
      "Testing\nVerify packages, generated docs, plugins, and the dogfood site.",
    );

    await page.locator("#squidoc-search-input").fill("zzzz-no-match");
    await expectText(page.locator(".sq-search__empty"), "No results found.");

    await page.goto(`${baseUrl}/search-index.json`, { waitUntil: "networkidle" });
    const searchIndex = JSON.parse(await page.locator("body").innerText());
    assert(
      searchIndex.some((entry) => entry.route === "/configuration"),
      "search-index.json should include /configuration",
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

async function expectAttribute(locator, name, expected) {
  const actual = await locator.getAttribute(name);
  assert(actual === expected, `Expected ${name}="${expected}", received "${actual}".`);
}

async function assertCount(locator, expected) {
  const actual = await locator.count();
  assert(actual === expected, `Expected ${expected} matches, received ${actual}.`);
}

async function expectFooterPinnedToViewport(page) {
  const footerBox = await page.locator(".sq-footer").boundingBox();
  const viewport = page.viewportSize();

  assert(footerBox, "Expected footer to be visible.");
  assert(viewport, "Expected a viewport size.");
  assert(
    Math.abs(footerBox.y + footerBox.height - viewport.height) <= 2,
    "Expected footer to pin to the viewport bottom on short pages.",
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

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
