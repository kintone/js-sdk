import { injectPlatformDeps } from "./platform";
import * as esmDeps from "./platform/esm";

injectPlatformDeps(esmDeps);

export { KintoneRestAPIClient } from "./KintoneRestAPIClient";
