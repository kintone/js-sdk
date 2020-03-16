import "core-js/features/promise";
import fs from "fs";
import { promisify } from "util";
import { basename } from "path";

import { injectPlatformDependencies } from "./platformDependencies";

const readFile = promisify(fs.readFile);
injectPlatformDependencies({
  readFileFromPath: async (filePath: string) => {
    const data = await readFile(filePath);
    const name = basename(filePath);
    return { data, name };
  }
});

export { KintoneRestAPIClient } from "./KintoneRestAPIClient";
