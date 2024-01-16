import fs from "fs";
import { mkdirp } from "mkdirp";
import type { CustomizeManifest } from "./index";
import type { Lang } from "../lang";
import { getBoundMessage } from "../messages";

export const getInitCustomizeManifest = (
  appId: string,
  scope: "ALL" | "ADMIN" | "NONE",
): CustomizeManifest => {
  return {
    app: appId,
    scope,
    desktop: {
      js: [],
      css: [],
    },
    mobile: {
      js: [],
      css: [],
    },
  };
};

export const generateCustomizeManifest = (
  customizeManifest: CustomizeManifest,
  destDir: string,
): Promise<any> => {
  if (!fs.existsSync(`${destDir}`)) {
    mkdirp.sync(`${destDir}`);
  }
  return new Promise((resolve, reject) => {
    return fs.writeFile(
      `${destDir}/customize-manifest.json`,
      JSON.stringify(customizeManifest, null, 4),
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.stringify(customizeManifest, null, 4));
        }
      },
    );
  });
};

export const runInit = async (
  appId: string,
  scope: "ALL" | "ADMIN" | "NONE",
  lang: Lang,
  destDir: string,
): Promise<any> => {
  const m = getBoundMessage(lang);
  const customizeManifest = getInitCustomizeManifest(appId, scope);
  await generateCustomizeManifest(customizeManifest, destDir);
  console.log(`${destDir}/${m("M_CommandInitFinish")}`);
};
