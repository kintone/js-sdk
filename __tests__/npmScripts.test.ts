import path from "path";
import { spawnSync } from "child_process";

const REQUIRED_NPMSCRIPTS = ["build", "clean", "lint", "test", "test:ci"];

const yarnCommand = process.platform === "win32" ? "yarn.cmd" : "yarn";

describe("npmScripts", () => {
  it("should define all required npm-scripts in all pacakges", () => {
    const packageInfo = JSON.parse(
      spawnSync(yarnCommand, ["workspaces", "info"]).stdout.toString()
    );
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
