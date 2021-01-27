import path from "path";

import { getWorkspacesInfo } from "./helper";

const REQUIRED_NPMSCRIPTS = ["build", "clean", "lint", "test", "test:ci"];

describe("npmScripts", () => {
  it("should define all required npm-scripts in all pacakges", () => {
    const packageInfo = getWorkspacesInfo();
    Object.entries<{ location: string }>(packageInfo).forEach(
      ([name, { location }]) => {
        if (location.indexOf("examples/") === 0) {
          return;
        }
        const npmScripts = require(path.resolve(location, "package.json"))
          .scripts;
        REQUIRED_NPMSCRIPTS.forEach((script) => {
          try {
            expect(typeof npmScripts[script]).toBe("string");
          } catch (e) {
            console.error(`${name} doesn't have "${script}" as a npm-scripts.`);
            throw e;
          }
        });
      }
    );
  });
});
