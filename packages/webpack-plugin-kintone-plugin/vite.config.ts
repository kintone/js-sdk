import path from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// The package source is authored as ESM ("type": "module"), but the published
// output must stay CommonJS: a webpack plugin is loaded via require() from the
// user's webpack.config (CommonJS), and require() of this package must return
// the plugin class directly. Vite/Rollup bundles the ESM source down to a
// single CommonJS module and rewrites import.meta.url for the CJS output.
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      formats: ["cjs"],
      fileName: () => "index.cjs",
    },
    // Node library: do not bundle dependencies or polyfill Node built-ins.
    ssr: true,
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      external: [/node_modules/, /^node:/],
      output: {
        // Emit `module.exports = KintonePlugin` so require() returns the class.
        exports: "default",
        interop: "auto",
      },
    },
  },
  plugins: [
    dts({
      exclude: [
        "**/__tests__/**",
        "**/*.test.ts",
        "vite.config.ts",
        "vitest.config.ts",
      ],
    }),
  ],
});
