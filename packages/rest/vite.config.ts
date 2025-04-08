import { defineConfig } from "vite";
import path from "node:path";
import dts from "vite-plugin-dts";
import { viteStaticCopy } from "vite-plugin-static-copy";

const outDir = "lib";

export default defineConfig({
  build: {
    lib: {
      entry: [
        path.resolve(__dirname, "src/index.ts"),
        path.resolve(__dirname, "src/index.browser.ts"),
      ],
      formats: ["es", "cjs"],
      fileName: "[format]/[name]",
    },
    sourcemap: "inline",
    outDir: outDir,
    rollupOptions: {
      output: {
        exports: "named",
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[format]/[name].js",
      },
      external: [/node_modules/],
    },
  },
  plugins: [
    dts({
      // tsconfigPath: "tsconfig.build.vite.json",
      outDir: [path.join(outDir, "es"), path.join(outDir, "cjs")],
      exclude: ["**/__tests__/*", "**/*.test.ts"],
    }),
    viteStaticCopy({
      targets: [
        {
          src: "src/package.esm.json",
          dest: "es",
          rename: "package.json",
        },
        {
          src: "src/package.cjs.json",
          dest: "cjs",
          rename: "package.json",
        },
      ],
    }),
  ],
});
