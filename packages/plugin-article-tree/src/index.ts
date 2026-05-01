import { definePlugin } from "@squidoc/core";

export default definePlugin({
  name: "@squidoc/plugin-article-tree",
  setup(api) {
    api.addThemeSlot({
      name: "article-tree",
      component: "@squidoc/plugin-article-tree/ArticleTree.astro",
      html: renderArticleTreeSlot(),
    });
  },
});

function renderArticleTreeSlot(): string {
  return `<nav class="sq-article-tree__nav" data-squidoc-article-tree aria-label="Article">
  <p class="sq-article-tree__title">On this page</p>
  <ol class="sq-article-tree__list"></ol>
</nav>
<script type="module">
const tree = document.querySelector("[data-squidoc-article-tree]");
const list = tree?.querySelector(".sq-article-tree__list");
const headings = [...document.querySelectorAll("main h2[id], main h3[id]")];

if (!tree || !list || headings.length === 0) {
  tree?.remove();
} else {
  const links = new Map();

  list.replaceChildren(...headings.map((heading) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.className = "sq-article-tree__link";
    link.href = "#" + heading.id;
    link.textContent = heading.textContent ?? "";
    link.dataset.depth = heading.tagName === "H3" ? "3" : "2";
    item.append(link);
    links.set(heading.id, link);
    return item;
  }));

  const setActive = (id) => {
    for (const link of links.values()) {
      link.toggleAttribute("data-active", link.hash === "#" + id);
    }
  };

  const getActiveHeading = () => {
    const focusY = window.scrollY + window.innerHeight * 0.6;
    let active = headings[0];

    for (const heading of headings) {
      const headingTop = heading.getBoundingClientRect().top + window.scrollY;

      if (headingTop <= focusY) {
        active = heading;
      } else {
        break;
      }
    }

    return active;
  };

  let frame = 0;
  const updateActiveHeading = () => {
    if (frame) {
      return;
    }

    frame = window.requestAnimationFrame(() => {
      frame = 0;
      const active = getActiveHeading();

      if (active?.id) {
        setActive(active.id);
      }
    });
  };

  updateActiveHeading();

  window.addEventListener("scroll", updateActiveHeading, { passive: true });
  window.addEventListener("resize", updateActiveHeading);

  const observer = new IntersectionObserver(updateActiveHeading, {
    rootMargin: "0px 0px -70% 0px",
    threshold: 0.1,
  });

  for (const heading of headings) {
    observer.observe(heading);
  }
}
</script>`;
}
