import path from "path";
import assert from "assert";

import { getWorkspaces } from "./lib/workspace";

const REQUIRED_NPMSCRIPTS = ["build", "clean", "lint", "test", "test:ci"];

describe("npmScripts", () => {
  it("should define all required npm-scripts in all pacakges", () => {
    const workspaces = getWorkspaces().filter(({ packagePath }) =>
      /\/packages\//.test(packagePath)
    );
    for (const { packageName, packagePath } of workspaces) {
      const { scripts } = require(path.resolve(packagePath, "package.json"));
      for (const requiredScript of REQUIRED_NPMSCRIPTS) {
        assert.strictEqual(
          typeof scripts[requiredScript],
          "string",
          `${packageName} doesn't have "${requiredScript}" as a npm-scripts.`
        );
      }
    }
  });
});
