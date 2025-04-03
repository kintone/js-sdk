import { defineConfig } from "vite";
import path from "node:path";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: [
        path.resolve(__dirname, "src/index.ts"),
        path.resolve(__dirname, "src/index.browser.ts"),
      ],
      formats: ["es", "cjs"],
      // fileName: "[format]/[name]",
    },
    sourcemap: "inline",
    outDir: "./lib/",
    rollupOptions: {
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
      },
      external: [/node_modules/],
    },
  },
  plugins: [dts({ tsconfigPath: "tsconfig.build.lib.json" })],
});
