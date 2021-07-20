import fs from "fs";
import path from "path";
import packer from ".";
import { createContentsZip } from "./create-contents-zip";

export const packPluginFromManifest = (
  manifestJSONPath: string,
  privateKey: string
): Promise<{ plugin: Buffer; privateKey: string; id: string }> => {
  return new Promise((resolve, reject) => {
    try {
      resolve(JSON.parse(fs.readFileSync(manifestJSONPath, "utf-8")));
    } catch (e) {
      reject(e);
    }
  })
    .then((manifest) =>
      createContentsZip(path.dirname(manifestJSONPath), manifest)
    )
    .then((buffer) => packer(buffer as any, privateKey));
};
