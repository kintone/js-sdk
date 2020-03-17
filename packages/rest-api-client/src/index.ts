import { injectPlatformDeps } from "./platform/";
import * as nodeDeps from "./platform/node";

injectPlatformDeps(nodeDeps);

export { KintoneRestAPIClient } from "./KintoneRestAPIClient";
