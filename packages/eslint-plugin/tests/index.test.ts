import { describe, expect, test } from "vitest";
import module from "node:module";
const require = module.createRequire(import.meta.url);
import plugin from "../src/index.js";

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
const pkgJson = require("../package.json") as typeof import("../package.json");

describe("metadata", () => {
  test("should match to the package.json", () => {
    expect(plugin.meta.name).toBe(pkgJson.name);
    expect(plugin.meta.version).toBe(pkgJson.version);
  });
});
