import { writeFileSync } from "node:fs";

// This package is authored as ESM ("type": "module"), but its build output in
// dist/ is emitted as CommonJS (tsconfig keeps module: commonjs). Drop a
// package.json marker so Node treats dist/ as CommonJS regardless of the ESM
// root, keeping `require()` working for CJS consumers such as
// @kintone/plugin-packer on Node < 22.
writeFileSync(
  "dist/package.json",
  `${JSON.stringify({ type: "commonjs" }, null, 2)}\n`,
);
