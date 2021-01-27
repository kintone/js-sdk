import path from "path";

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
        try {
          expect(typeof scripts[requiredScript]).toBe("string");
        } catch (e) {
          console.error(
            `${packageName} doesn't have "${requiredScript}" as a npm-scripts.`
          );
          throw e;
        }
      }
    }
  });
});
