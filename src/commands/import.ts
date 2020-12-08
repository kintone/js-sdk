import fs from "fs";
import mkdirp from "mkdirp";
import { sep } from "path";
import { Constans } from "../constants";
import { CustomizeManifest } from "./index";
import KintoneApiClient, { AuthenticationError } from "../KintoneApiClient";
import { Lang } from "../lang";
import { getBoundMessage } from "../messages";
import { wait } from "../util";

export interface Option {
  lang: Lang;
  proxy: string;
  guestSpaceId: number;
  destDir: string;
}

export interface ImportCustomizeManifest {
  app: string;
}

interface UploadedFile {
  type: "FILE";
  file: {
    fileKey: string;
    name: string;
  };
}

interface CDNFile {
  type: "URL";
  url: string;
}
type CustomizeFile = UploadedFile | CDNFile;

interface GetAppCustomizeResp {
  scope: "ALL" | "ADMIN" | "NONE";
  desktop: {
    js: CustomizeFile[];
    css: CustomizeFile[];
  };
  mobile: {
    js: CustomizeFile[];
    css: CustomizeFile[];
  };
}

export async function importCustomizeSetting(
  kintoneApiClient: KintoneApiClient,
  manifest: ImportCustomizeManifest,
  status: {
    retryCount: number;
  },
  options: Option
): Promise<void> {
  const m = getBoundMessage(options.lang);
  const appId = manifest.app;
  let { retryCount } = status;

  try {
    const appCustomize = kintoneApiClient.getAppCustomize(appId);
    return appCustomize
      .then((resp: GetAppCustomizeResp) => {
        console.log(m("M_UpdateManifestFile"));
        return exportAsManifestFile(appId, options.destDir, resp);
      })
      .then((resp: GetAppCustomizeResp) => {
        console.log(m("M_DownloadUploadedFile"));
        return downloadCustomizeFiles(
          kintoneApiClient,
          appId,
          options.destDir,
          resp
        );
      });
  } catch (e) {
    const isAuthenticationError = e instanceof AuthenticationError;
    retryCount++;
    if (isAuthenticationError) {
      throw new Error(m("E_Authentication"));
    } else if (retryCount < Constans.MAX_RETRY_COUNT) {
      await wait(1000);
      console.log(m("E_Retry"));
      return importCustomizeSetting(
        kintoneApiClient,
        manifest,
        { retryCount },
        options
      );
    } else {
      throw e;
    }
  }
}

function exportAsManifestFile(
  appId: string,
  destRootDir: string,
  resp: GetAppCustomizeResp
): GetAppCustomizeResp {
  const toNameOrUrl = (destDir: string) => (f: CustomizeFile) => {
    if (f.type === "FILE") {
      return `${destDir}/${f.file.name}`;
    }
    return f.url;
  };

  const desktopJs: CustomizeFile[] = resp.desktop.js;
  const desktopCss: CustomizeFile[] = resp.desktop.css;
  const mobileJs: CustomizeFile[] = resp.mobile.js;
  const mobileCss: CustomizeFile[] = resp.mobile.css;

  const customizeJson: CustomizeManifest = {
    app: appId,
    scope: resp.scope,
    desktop: {
      js: desktopJs.map(toNameOrUrl(`${destRootDir}/desktop/js`)),
      css: desktopCss.map(toNameOrUrl(`${destRootDir}/desktop/css`)),
    },
    mobile: {
      js: mobileJs.map(toNameOrUrl(`${destRootDir}/mobile/js`)),
      css: mobileCss.map(toNameOrUrl(`${destRootDir}/mobile/css`)),
    },
  };

  if (!fs.existsSync(`${destRootDir}`)) {
    mkdirp.sync(`${destRootDir}`);
  }
  fs.writeFileSync(
    `${destRootDir}/customize-manifest.json`,
    JSON.stringify(customizeJson, null, 4)
  );
  return resp;
}

async function downloadCustomizeFiles(
  kintoneApiClient: KintoneApiClient,
  appId: string,
  destDir: string,
  { desktop, mobile }: GetAppCustomizeResp
): Promise<any> {
  const desktopJs: CustomizeFile[] = desktop.js;
  const desktopCss: CustomizeFile[] = desktop.css;
  const mobileJs: CustomizeFile[] = mobile.js;
  const mobileCss: CustomizeFile[] = mobile.css;
  [
    `${destDir}${sep}desktop${sep}js${sep}`,
    `${destDir}${sep}desktop${sep}css${sep}`,
    `${destDir}${sep}mobile${sep}js${sep}`,
    `${destDir}${sep}mobile${sep}css${sep}`,
  ].forEach((path) => mkdirp.sync(path));

  const desktopJsPromise = desktopJs.map(
    downloadAndWriteFile(kintoneApiClient, `${destDir}${sep}desktop${sep}js`)
  );
  const desktopCssPromise = desktopCss.map(
    downloadAndWriteFile(kintoneApiClient, `${destDir}${sep}desktop${sep}css`)
  );
  const mobileJsPromise = mobileJs.map(
    downloadAndWriteFile(kintoneApiClient, `${destDir}${sep}mobile${sep}js`)
  );
  const mobileCssPromise = mobileCss.map(
    downloadAndWriteFile(kintoneApiClient, `${destDir}${sep}mobile${sep}css`)
  );
  return [
    ...desktopJsPromise,
    ...desktopCssPromise,
    ...mobileJsPromise,
    ...mobileCssPromise,
  ];
}

function downloadAndWriteFile(
  kintoneApiClient: KintoneApiClient,
  destDir: string
): (f: CustomizeFile) => void {
  return async (f) => {
    if (f.type !== "URL") {
      const resp = await kintoneApiClient.downloadFile(f.file.fileKey);
      fs.writeFileSync(`${destDir}${sep}${f.file.name}`, resp);
    }
  };
}

export const runImport = async (
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
  const manifest: ImportCustomizeManifest = JSON.parse(
    fs.readFileSync(manifestFile, "utf8")
  );
  const status = {
    retryCount: 0,
  };

  const kintoneApiClient = new KintoneApiClient(
    username,
    password,
    oAuthToken,
    basicAuthUsername,
    basicAuthPassword,
    domain,
    options
  );
  await importCustomizeSetting(kintoneApiClient, manifest, status, options);
  console.log(m("M_CommandImportFinish"));
};
