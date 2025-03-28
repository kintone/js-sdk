import { injectPlatformDeps } from "./platform/";
import browserDeps from "./platform/browser";

injectPlatformDeps(browserDeps);

import { createClient } from "./client";
import { iterator } from "./helpers/iterator";

export { createClient, iterator };
