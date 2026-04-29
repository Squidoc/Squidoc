import { definePlugin } from "@squidoc/core";

export default definePlugin({
  name: "@squidoc/plugin-seo",
  setup(api) {
    api.addGeneratedFile({
      path: "robots.txt",
      contents: ["User-agent: *", "Allow: /", ""].join("\n"),
    });
  },
});
