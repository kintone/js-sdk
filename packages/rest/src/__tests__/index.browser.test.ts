// @vitest-environment jsdom

import { assertType, describe, it } from "vitest";
import { createClient } from "../client/index.js";
import type { Client } from "openapi-fetch";

import { injectPlatformDeps } from "../platform/index.js";
import browserDeps from "../platform/browser.js";

injectPlatformDeps(browserDeps);

describe("createClient", () => {
  it("can be called without params on browser", () => {
    const client = createClient();
    assertType<Client<{}>>(client);
  });
});
