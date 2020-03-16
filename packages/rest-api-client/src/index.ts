import "core-js/features/promise";
import { readFileFromPath } from "./platform/node";

import { injectPlatformDependencies } from "./platform/platformDependencies";

injectPlatformDependencies({
  readFileFromPath
});

export { KintoneRestAPIClient } from "./KintoneRestAPIClient";
