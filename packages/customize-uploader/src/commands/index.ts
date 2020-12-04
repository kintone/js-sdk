import chokidar from "chokidar";
import fs from "fs";
import KintoneApiClient, { AuthenticationError } from "../KintoneApiClient";
import { Lang } from "../lang";
import { getBoundMessage } from "../messages";
import { isUrlString, wait } from "../util";

export interface Option {
  watch?: string;
  lang: Lang;
  proxy: string;
  guestSpaceId: number;
}

export interface Status {
  retryCount: number;
  updateBody: any;
  updated: boolean;
}

export interface CustomizeManifest {
  app: string;
  scope: "ALL" | "ADMIN" | "NONE";
  desktop: {
    js: string[];
    css: string[];
  };
  mobile: {
    js: string[];
    css: string[];
  };
}

const MAX_RETRY_COUNT = 3;

export async function upload(
  kintoneApiClient: KintoneApiClient,
  manifest: CustomizeManifest,
  status: {
    retryCount: number;
    updateBody: any;
    updated: boolean;
  },
  options: Option
): Promise<void> {
  const m = getBoundMessage(options.lang);
  const appId = manifest.app;
  let { retryCount, updateBody, updated } = status;

  try {
    if (!updateBody) {
      console.log(m("M_StartUploading"));
      try {
        const [desktopJS, desktopCSS, mobileJS, mobileCSS] = await Promise.all(
          [
            manifest.desktop.js,
            manifest.desktop.css,
            manifest.mobile.js,
            manifest.mobile.css,
          ].map((files) =>
            Promise.all(
              files.map((file: string) =>
                kintoneApiClient.prepareCustomizeFile(file).then((result) => {
                  if (result.type === "FILE") {
                    console.log(`${file} ` + m("M_Uploaded"));
                  }
                  return result;
                })
              )
            )
          )
        );
        updateBody = Object.assign({}, manifest, {
          desktop: {
            js: desktopJS,
            css: desktopCSS,
          },
          mobile: {
            js: mobileJS,
            css: mobileCSS,
          },
        });
        console.log(m("M_FileUploaded"));
      } catch (e) {
        console.log(m("E_FileUploaded"));
        throw e;
      }
    }

    if (!updated) {
      try {
        await kintoneApiClient.updateCustomizeSetting(updateBody);
        console.log(m("M_Updated"));
        updated = true;
      } catch (e) {
        console.log(m("E_Updated"));
        throw e;
      }
    }

    try {
      await kintoneApiClient.deploySetting(appId);
      await kintoneApiClient.waitFinishingDeploy(appId, () =>
        console.log(m("M_Deploying"))
      );
      console.log(m("M_Deployed"));
    } catch (e) {
      console.log(m("E_Deployed"));
      throw e;
    }
  } catch (e) {
    const isAuthenticationError = e instanceof AuthenticationError;
    retryCount++;
    if (isAuthenticationError) {
      throw new Error(m("E_Authentication"));
    } else if (retryCount < MAX_RETRY_COUNT) {
      await wait(1000);
      console.log(m("E_Retry"));
      await upload(
        kintoneApiClient,
        manifest,
        { retryCount, updateBody, updated },
        options
      );
    } else {
      throw e;
    }
  }
}

export const run = async (
  domain: string,
  username: string | null,
  password: string | null,
  oAuthToken: string | null,
  basicAuthUsername: string | null,
  basicAuthPassword: string | null,
  manifestFile: string,
  options: Option
): Promise<void> => {
  const m = getBoundMessage(options.lang);

  const manifest: CustomizeManifest = JSON.parse(
    fs.readFileSync(manifestFile, "utf8")
  );
  const status = {
    retryCount: 0,
    updateBody: null,
    updated: false,
  };

  // support an old format for customize-manifest.json that doesn't have mobile.css
  manifest.mobile.css = manifest.mobile.css || [];

  const files = manifest.desktop.js
    .concat(manifest.desktop.css, manifest.mobile.js, manifest.mobile.css)
    .filter((fileOrPath: string) => !isUrlString(fileOrPath));

  const kintoneApiClient = new KintoneApiClient(
    username,
    password,
    oAuthToken,
    basicAuthUsername,
    basicAuthPassword,
    domain,
    options
  );
  await upload(kintoneApiClient, manifest, status, options);

  if (options.watch) {
    const watcher = chokidar.watch(files, {
      // Avoid that multiple change events were fired depending on which OS or text editors you are using with
      // Note that there would be higher possibility to get errors if you set smaller value of 'stabilityThreshold'
      awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100,
      },
    });
    console.log(m("M_Watching"));
    watcher.on("change", () =>
      upload(kintoneApiClient, manifest, status, options)
    );
  }
};

export * from "./import";
export * from "./init";
