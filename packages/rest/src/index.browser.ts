import { injectPlatformDeps } from "./platform/";
import browserDeps from "./platform/node";

injectPlatformDeps(browserDeps);

import { createClient } from "./client";
import { iterator } from "./helpers/iterator";

export { createClient, iterator };
