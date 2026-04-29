import { definePlugin } from "@squidoc/core";

export default definePlugin({
  name: "@squidoc/plugin-search",
  setup(api) {
    api.addThemeSlot({
      name: "search",
      component: "@squidoc/plugin-search/Search.astro",
    });
  },
});
