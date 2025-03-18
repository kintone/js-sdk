import { defineConfig } from "vite";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import license from "rollup-plugin-license";
import globals from "rollup-plugin-node-globals";
import builtins from "rollup-plugin-node-builtins";
import nodePolyfills from "rollup-plugin-polyfill-node";
import babel from "@rollup/plugin-babel";
import { ecmaVersionValidator } from "rollup-plugin-ecma-version-validator";
import fs from "fs";

const licenseText = fs.readFileSync("LICENSE", "utf-8");
const licenseTemplate = `
${licenseText}

This bundle includes the following third-party libraries:
<% _.forEach(dependencies, function (dependency) { %>
  =====
  <%= dependency.name %>@<%= dependency.version %> -- <%= dependency.license %>
  -----

  <%= dependency.licenseText %>
<% }) %>
`;

const extensions = [".ts", ".js"];
const isProd = process.env.BUILD === "production";

export default defineConfig({
  build: {
    lib: {
      // extend: true,
      entry: "./src/index.browser.ts",
      name: "KintoneRest",
      format: "umd",
      fileName: `KintoneRest`,
      sourcemap: "inline",
    },
    target: "es2022",
    outDir: "./umd",
    rollupOptions: {
      external: ["./src/index.ts", "./src/platform/node.ts"],
    },
  },
  plugins: [
    babel({
      babelHelpers: "bundled",
      presets: [
        [
          "@babel/preset-env",
          {
            corejs: 3,
            useBuiltIns: "usage",
          },
        ],
        "@babel/preset-typescript",
      ],
      extensions,
      include: ["src/**/*"],
    }),
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs({ extensions }),
    babel({
      babelHelpers: "bundled",
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              // see kintone's supported browsers https://get.kintone.help/general/en/user/list_start/webbrowser.html
              browsers: [
                "last 2 edge versions",
                "last 2 firefox version",
                "last 2 chrome versions",
                "last 2 safari versions",
                "iOS >= 14",
                "last 2 and_chr versions",
              ],
            },
          },
        ],
      ],
    }),
    json(),
    // globals(),
    nodePolyfills(),
    isProd && terser(),
    // ecmaVersionValidator({ ecmaVersion: 2022 }),
    license({
      banner: {
        commentStyle: "regular",
        content: licenseTemplate,
      },
    }),
  ],
});
