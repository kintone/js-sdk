import { injectPlatformDeps } from "./platform/index.js";
import * as browserDeps from "./platform/browser.js";

injectPlatformDeps(browserDeps);

export { KintoneRestAPIClient } from "./KintoneRestAPIClient.js";
export * from "./error/index.js";
