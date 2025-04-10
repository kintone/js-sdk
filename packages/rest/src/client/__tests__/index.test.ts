import { assertType, describe, expect, expectTypeOf, it } from "vitest";
import { createClient } from "../index.js";
import type { Client } from "openapi-fetch";

describe("createClient", () => {
  it("can be called without params", () => {
    const client = createClient();
    assertType<Client<{}>>(client);
  });
});
