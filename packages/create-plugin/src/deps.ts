"use strict";

import { spawnSync } from "child_process";
import { Lang } from "./lang";
import { printLog } from "./logger";
import { getMessage } from "./messages";

/**
 * Install specified dependencies
 * @param outputDirectory
 */
export const installDependencies = (
  outputDirectory: string,
  lang: Lang
): void => {
  printLog(getMessage(lang, "installDependencies"));

  const result = spawnSync("npm", ["install"], {
    cwd: outputDirectory,
    stdio: "inherit",
    shell: true,
  });
  if (result.status !== 0) {
    throw new Error("Installing dependencies were failed");
  }
};
