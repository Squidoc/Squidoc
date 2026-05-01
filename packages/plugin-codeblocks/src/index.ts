import { definePlugin } from "@squidoc/core";
import { codeToHtml } from "shiki";

export type CodeblocksOptions = {
  theme?: string;
};

const CODE_BLOCK_PATTERN = /<pre><code(?: class="language-([^"]+)")?>([\s\S]*?)<\/code><\/pre>/g;
const COPY_SCRIPT = `<script>
(() => {
  if (window.__squidocCodeblocksReady) {
    return;
  }

  window.__squidocCodeblocksReady = true;

  async function writeClipboard(text) {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch {
        // Fall back when the browser exposes Clipboard API but blocks writes.
      }
    }

    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.top = "-9999px";
    document.body.append(textArea);
    textArea.select();
    const copied = document.execCommand("copy");
    textArea.remove();

    if (!copied) {
      throw new Error("Copy command failed.");
    }
  }

  document.addEventListener("click", async (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const button = target?.closest("[data-squidoc-copy-code]");

    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    const block = button.closest("[data-squidoc-codeblock]");
    const code = block?.querySelector("pre code");

    if (!code) {
      return;
    }

    const originalLabel = button.textContent ?? "Copy";
    button.textContent = "Copying";
    button.dataset.state = "copying";

    try {
      await writeClipboard(code.textContent ?? "");
      button.textContent = "Copied";
      button.dataset.state = "copied";
      window.setTimeout(() => {
        button.textContent = originalLabel;
        delete button.dataset.state;
      }, 1600);
    } catch {
      button.textContent = "Failed";
      button.dataset.state = "failed";
      window.setTimeout(() => {
        button.textContent = originalLabel;
        delete button.dataset.state;
      }, 1600);
    }
  });
})();
</script>`;

export default definePlugin({
  name: "@squidoc/plugin-codeblocks",
  setup(api) {
    api.addHtmlTransformer(async (html) => {
      let transformedCodeblocks = 0;
      const transformed = await replaceAsync(
        html,
        CODE_BLOCK_PATTERN,
        async (_match, language, encodedCode) => {
          const code = decodeHtml(encodedCode);
          const highlighted = await codeToHtml(code, {
            lang: language || "text",
            theme: "github-light",
          });

          transformedCodeblocks += 1;

          return renderCodeblock(highlighted);
        },
      );

      return transformedCodeblocks > 0 ? `${transformed}\n${COPY_SCRIPT}` : transformed;
    });
  },
});

function renderCodeblock(highlighted: string): string {
  return [
    '<div class="sq-codeblock" data-squidoc-codeblock>',
    '<button class="sq-codeblock__copy" type="button" data-squidoc-copy-code aria-label="Copy code">',
    "Copy",
    "</button>",
    highlighted,
    "</div>",
  ].join("");
}

async function replaceAsync(
  value: string,
  pattern: RegExp,
  replacer: (...match: string[]) => Promise<string>,
): Promise<string> {
  const replacements = await Promise.all(
    [...value.matchAll(pattern)].map((match) => replacer(...match)),
  );
  let index = 0;

  return value.replace(pattern, () => replacements[index++] ?? "");
}

function decodeHtml(value: string): string {
  return value
    .replaceAll("&#x3C;", "<")
    .replaceAll("&#x3c;", "<")
    .replaceAll("&#60;", "<")
    .replaceAll("&#x3E;", ">")
    .replaceAll("&#x3e;", ">")
    .replaceAll("&#62;", ">")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&");
}
