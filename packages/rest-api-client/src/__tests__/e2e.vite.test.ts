import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { rimrafSync } from "rimraf";

const tempDir = fs.mkdtempSync(
  path.join(os.tmpdir(), "kintone-rest-api-client-bundle-"),
);

describe("Vite CLI Bundler tests", function () {
  it(`should be able to build with Vite successfully`, () => {
    const buildResult = spawnSync(
      "vite build",
      ["--config", "fixtures/vite.config.mjs"],
      {
        cwd: __dirname,
        stdio: "inherit",
        shell: true,
        env: {
          ...process.env,
          TEMP_DIR: tempDir,
        },
      },
    );
    expect(buildResult.status).toBe(0);
  });

  afterAll(() => {
    rimrafSync(tempDir);
  });
});
