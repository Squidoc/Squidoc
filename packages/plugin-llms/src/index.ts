import { definePlugin } from "@squidoc/core";

export default definePlugin({
  name: "@squidoc/plugin-llms",
  setup(api) {
    api.addGeneratedFile({
      path: "llms.txt",
      contents: "# llms.txt\n\nThis file will be generated from the documentation index.\n",
    });
  },
});
