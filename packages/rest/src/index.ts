import { injectPlatformDeps } from "./platform/";
import nodeDeps from "./platform/node";

injectPlatformDeps(nodeDeps);

import { createClient } from "./client";
import { iterator } from "./helpers/iterator";

export { createClient, iterator };
