import { injectPlatformDeps } from "./platform/index.js";
import browserDeps from "./platform/browser.js";

injectPlatformDeps(browserDeps);

import { createClient } from "./client/index.js";
import { iterator } from "./helpers/iterator.js";

export { createClient, iterator };
