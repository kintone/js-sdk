import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/index.browser.ts"],
  // minify: false,
  // minify: true,
  // keepNames: true,
  format: ["esm", "cjs"],
  dts: true,
  tsconfig: "./tsconfig.build.tsup.json",
  // bundle: false,
  // splitting: false,
  sourcemap: true,
  clean: true,
});
