import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeHeadingAnchors)
  .use(rehypeStringify);

export async function renderMarkdown(content: string): Promise<string> {
  const file = await processor.process(content);
  return String(file);
}

function rehypeHeadingAnchors() {
  return (tree: HastNode) => {
    visit(tree, (node) => {
      if (!isHeading(node)) {
        return;
      }

      const id = readString(node.properties?.id);

      if (!id || hasHeadingAnchor(node)) {
        return;
      }

      node.children.push({
        type: "element",
        tagName: "a",
        properties: {
          ariaLabel: "Link to this section",
          className: ["sq-heading-anchor"],
          href: `#${id}`,
        },
        children: [],
      });
    });
  };
}

type HastNode = {
  type?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  value?: string;
};

function visit(node: HastNode, visitor: (node: HastNode) => void): void {
  visitor(node);

  for (const child of node.children ?? []) {
    visit(child, visitor);
  }
}

function isHeading(node: HastNode): node is HastNode & { children: HastNode[] } {
  return (
    node.type === "element" &&
    typeof node.tagName === "string" &&
    /^h[1-6]$/.test(node.tagName) &&
    Array.isArray(node.children)
  );
}

function hasHeadingAnchor(node: HastNode): boolean {
  return (
    node.children?.some((child) => {
      const className = child.properties?.className;

      return Array.isArray(className) && className.includes("sq-heading-anchor");
    }) ?? false
  );
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}
