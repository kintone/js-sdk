import createClient from "openapi-fetch";
import { paths } from "./schemas/schema";
import { iterator } from "./helpers/iterator";
import { injectPlatformDeps } from "./platform";
import * as node from "./platform/node";

injectPlatformDeps(node);

export { createClient, iterator, paths };
