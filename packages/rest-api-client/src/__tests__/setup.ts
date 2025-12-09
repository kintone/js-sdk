import { beforeEach, expect } from "vitest";
import { injectPlatformDeps } from "../platform/";
import * as nodeDeps from "../platform/node";

beforeEach(() => {
  injectPlatformDeps(nodeDeps);
});
