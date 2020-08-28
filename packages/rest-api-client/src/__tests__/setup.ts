import { injectPlatformDeps } from "../platform/";
import * as nodeDeps from "../platform/node";
import { injectPackageJson } from "../platform/packageJson";

beforeEach(() => {
  injectPackageJson(require("../../package.json"));
  injectPlatformDeps(nodeDeps);
});
