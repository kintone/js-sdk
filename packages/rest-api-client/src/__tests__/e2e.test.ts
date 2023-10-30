import assert from "assert";
import { spawnSync } from "child_process";
import { pattern as RollupPattern } from "./fixtures/rollup";
import { pattern as VitePattern } from "./fixtures/vite";
import { pattern as WebpackPattern } from "./fixtures/webpack";

export type TestPattern = {
  bundlerName: string;
  input: {
    command: string;
    args: string[];
    cwd: string;
  };
};

const patterns = [RollupPattern, VitePattern, WebpackPattern];

describe("Bundlers tests", function () {
  it.each(patterns)(
    `should be able to build with $bundlerName successfully`,
    async ({ input }) => {
      const buildResult = spawnSync(input.command, input.args, {
        cwd: input.cwd,
        stdio: "inherit",
        shell: true,
      });
      assert(buildResult.status === 0);
    }
  );
});
