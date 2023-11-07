import { spawnSync } from "child_process";
import { pattern as RollupPattern } from "./fixtures/rollup";
import { pattern as VitePattern } from "./fixtures/vite";
import { pattern as WebpackPattern } from "./fixtures/webpack";
import fs from "fs";
import path from "path";
import os from "os";
import { rimrafSync } from "rimraf";

export type TestPattern = {
  bundlerName: string;
  input: {
    command: string;
    args: string[];
    cwd: string;
  };
};

const patterns = [RollupPattern, VitePattern, WebpackPattern];

const tempDir = fs.mkdtempSync(
  path.join(os.tmpdir(), "kintone-rest-api-client-bundle-")
);

describe("Bundlers tests", function () {
  it.each(patterns)(
    `should be able to build with $bundlerName successfully`,
    async ({ input }) => {
      const buildResult = spawnSync(input.command, input.args, {
        cwd: input.cwd,
        stdio: "inherit",
        shell: true,
        env: {
          ...process.env,
          TEMP_DIR: tempDir,
        },
      });
      expect(buildResult.status).toBe(0);
    }
  );

  afterAll(() => {
    rimrafSync(tempDir);
  });
});
