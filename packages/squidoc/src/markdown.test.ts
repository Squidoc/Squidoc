import { describe, expect, test } from "vitest";
import { renderMarkdown } from "./markdown.js";

describe("renderMarkdown", () => {
  test("adds heading ids and share anchors", async () => {
    const html = await renderMarkdown("## Plugin options\n\n### Nested heading");

    expect(html).toContain('id="plugin-options"');
    expect(html).toContain('href="#plugin-options"');
    expect(html).toContain('class="sq-heading-anchor"');
    expect(html).toContain('aria-label="Link to this section"');
    expect(html).toContain('href="#nested-heading"');
  });
});
