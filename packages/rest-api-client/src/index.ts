import { injectPlatformDeps } from "./platform/";
import * as nodeDeps from "./platform/node";
import { injectPackageJson } from "./platform/packageJson";

injectPackageJson(require("../package.json"));
injectPlatformDeps(nodeDeps);

export { KintoneRestAPIClient } from "./KintoneRestAPIClient";
