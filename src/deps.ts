"use strict";

import { spawnSync } from "child_process";
import { Lang } from "./lang";
import { printLog } from "./logger";
import { getMessage } from "./messages";

/**
 * Install specified dependencies
 * @param outputDirectory
 */
export function installDependencies(outputDirectory: string, lang: Lang): void {
  printLog(getMessage(lang, "installDependencies"));

  const spawnOption = {
    cwd: outputDirectory,
    stdio: "inherit",
    shell: true,
  };

  const result = spawnSync("npm", ["install"], spawnOption);
  if (result.status !== 0) {
    throw new Error("Installing dependencies were failed");
  }
}
