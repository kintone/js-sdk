import module from "module";
import os from "os";
// eslint-disable-next-line node/no-unsupported-features/node-builtins
const _require = module.createRequire(import.meta.url);
let packageJson = null;

export * from "./node";
export const buildHeaders = () => {
  if (packageJson === null) {
    // NOTE: package.json path is seen from bundled file because this file is bundled to esm/index.mjs
    packageJson = _require("../package.json");
  }
  return {
    "User-Agent": `Node.js/${process.version}(${os.type()}) ${
      packageJson.name
    }@${packageJson.version}`,
  };
};
