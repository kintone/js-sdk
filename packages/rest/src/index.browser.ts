import createClient from "openapi-fetch";
import { paths } from "./schemas/schema";
import { iterator } from "./helpers/iterator";
import { injectPlatformDeps } from "./platform";
import * as browser from "./platform/browser";

injectPlatformDeps(browser);

export { createClient, iterator, paths };
