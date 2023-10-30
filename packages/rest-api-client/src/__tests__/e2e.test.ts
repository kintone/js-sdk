import assert from "assert";
import { spawnSync } from "child_process";

describe("Bundlers tests", function () {
  it("should be able to build with Webpack successfully", () => {
    const buildResult = spawnSync(
      "webpack",
      ["--config", "webpack.config.mjs"],
      {
        cwd: __dirname + "/fixtures/webpack",
        stdio: "inherit",
        shell: true,
      }
    );
    assert(buildResult.status === 0);
  });

  it("should be able to build with Rollup successfully", () => {
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

  it("should be able to build with Vite successfully", () => {
    const buildResult = spawnSync(
      "vite build",
      ["--config", "vite.config.mjs"],
      {
        cwd: __dirname + "/fixtures/vite",
        stdio: "inherit",
        shell: true,
      }
    );
    assert(buildResult.status === 0);
  });
});
