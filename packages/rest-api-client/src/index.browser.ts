import "core-js/features/promise";

import { injectPlatformDeps } from "./platform/";
import * as browserDeps from "./platform/browser";
import { KintoneRestAPIClient } from "./KintoneRestAPIClient";

injectPlatformDeps(browserDeps);

export { KintoneRestAPIClient } from "./KintoneRestAPIClient";

// @ts-ignore
window.KintoneRestAPIClient = KintoneRestAPIClient;
