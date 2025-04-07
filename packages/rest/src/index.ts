import { injectPlatformDeps } from "./platform/index.js";
import nodeDeps from "./platform/node.js";

injectPlatformDeps(nodeDeps);

import { createClient } from "./client/index.js";
import { iterator } from "./helpers/iterator.js";

export { createClient, iterator };
