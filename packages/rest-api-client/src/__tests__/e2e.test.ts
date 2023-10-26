import assert from "assert";
import { spawnSync } from "child_process";

describe("Bundlers tests", function () {
  describe("Build with webpack", () => {
    it("should be able to build the package with webpack successfully", () => {
      const buildResult = spawnSync(
        "webpack",
        ["--config", "webpack.config.js"],
        {
          cwd: __dirname + "/fixtures/webpack",
          stdio: "inherit",
          shell: true,
        }
      );
      assert(buildResult.status === 0);
    });
  });
});
