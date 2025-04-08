import { defineConfig } from "vite";
import path from "node:path";
import fs from "fs";
import license from "vite-plugin-license";

import pkgJson from "./package.json";

const licenseText = fs.readFileSync("LICENSE", "utf-8");
const licenseTemplate = `
${pkgJson.name}@${pkgJson.version} by ${pkgJson.author.name}

${licenseText}

This bundle includes the following third-party libraries:
<% _.forEach(dependencies, function (dependency) { %>
  =====
  <%= dependency.name %>@<%= dependency.version %> -- <%= dependency.license %>
  -----

  <%= dependency.licenseText %>
<% }) %>
`;

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";

  return {
    build: {
      lib: {
        entry: path.resolve(__dirname, "src/index.browser.ts"),
        name: "KintoneRest",
        formats: ["umd"],
        fileName: `KintoneRest`,
      },
      // https://vite.dev/guide/build#browser-compatibility
      target: "modules",
      minify: isProd ? "terser" : false,
      sourcemap: isProd ? false : "inline",
      outDir: "umd",
      rollupOptions: {
        external: ["./src/index.ts", "./src/platform/node.ts"],
      },
    },
    plugins: [
      license({
        sourcemap: !isProd,
        debug: !isProd,
        banner: {
          commentStyle: "regular",
          content: licenseTemplate,
        },
      }),
    ],
  };
});
