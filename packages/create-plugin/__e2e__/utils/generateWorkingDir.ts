import fs from "fs";
import path from "path";
import os from "os";

export const generateWorkingDir = (): string => {
  return fs.mkdtempSync(
    path.join(os.tmpdir(), `create-plugin-e2e-test-${new Date().valueOf()}-`),
  );
};
