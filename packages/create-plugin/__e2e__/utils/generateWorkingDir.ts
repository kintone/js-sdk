import fs from "fs";
import path from "path";
import os from "os";

let workingDir: string;
export const generateWorkingDir = (): string => {
  workingDir = fs.mkdtempSync(
    path.join(os.tmpdir(), `create-plugin-e2e-test-${new Date().valueOf()}-`),
  );
  console.log(`Working directory: ${workingDir}`);

  return workingDir;
};

export const getWorkingDir = (): string => {
  if (!workingDir) {
    return generateWorkingDir();
  }

  return workingDir;
};
