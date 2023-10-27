import assert from "assert";
import { spawnSync } from "child_process";

describe("Bundlers tests", function () {
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

  it("should be able to build the package with rollup successfully", () => {
    const buildResult = spawnSync(
      "rollup",
      ["--config", "rollup.config.mjs", "--failAfterWarnings"],
      {
        cwd: __dirname + "/fixtures/rollup",
        stdio: "inherit",
        shell: true,
      }
    );
    assert(buildResult.status === 0);
  });
});
