import { definePlugin } from "@squidoc/core";

export default definePlugin({
  name: "@squidoc/plugin-mdx",
  setup(api) {
    api.addDocExtension(".mdx");
  },
});
