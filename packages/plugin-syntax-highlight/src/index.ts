import { definePlugin } from "@squidoc/core";
import { codeToHtml } from "shiki";

export type SyntaxHighlightOptions = {
  theme?: string;
};

const CODE_BLOCK_PATTERN = /<pre><code(?: class="language-([^"]+)")?>([\s\S]*?)<\/code><\/pre>/g;

export default definePlugin({
  name: "@squidoc/plugin-syntax-highlight",
  setup(api) {
    api.addHtmlTransformer(async (html) =>
      replaceAsync(html, CODE_BLOCK_PATTERN, async (_match, language, encodedCode) => {
        const code = decodeHtml(encodedCode);

        return codeToHtml(code, {
          lang: language || "text",
          theme: "github-light",
        });
      }),
    );
  },
});

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
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&");
}
