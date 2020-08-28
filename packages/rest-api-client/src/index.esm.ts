import { injectPlatformDeps } from "./platform";
import * as nodeDeps from "./platform/node";
import { injectPackageJson } from "./platform/packageJson";
import module from "module";
// @ts-expect-error to avoid `The 'import.meta' meta-property is only allowed when the '--module' option is 'esnext' or 'system'.`
// eslint-disable-next-line node/no-unsupported-features/node-builtins
const _require = module.createRequire(import.meta.url);

injectPackageJson(_require("../package.json"));
injectPlatformDeps(nodeDeps);

export { KintoneRestAPIClient } from "./KintoneRestAPIClient";
