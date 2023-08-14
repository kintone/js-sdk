import chokidar from "chokidar";
import fs from "fs";
import KintoneApiClient, { AuthenticationError } from "../KintoneApiClient";
import type { Lang } from "../lang";
import type { messages } from "../messages";
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

export interface GeneralInputParams {
  baseUrl: string;
  username: string | null;
  password: string | null;
  oAuthToken: string | null;
  basicAuthUsername: string | null;
  basicAuthPassword: string | null;
  manifestFile: string;
}

export interface InputParams extends GeneralInputParams {
  options: Option;
}

interface JsCssManifest {
  desktop: {
    js: string[];
    css: string[];
  };
  mobile: {
    js: string[];
    css: string[];
  };
}

interface HandleUploadErrorParameter {
  error: any;
  manifest: CustomizeManifest;
  updateBody: any;
  updated: boolean;
  retryCount: number;
  options: Option;
  boundMessage: (key: keyof typeof messages) => string;
  kintoneApiClient: KintoneApiClient;
}

const MAX_RETRY_COUNT = 3;

export const upload = async (
  kintoneApiClient: KintoneApiClient,
  manifest: CustomizeManifest,
  status: {
    retryCount: number;
    updateBody: any;
    updated: boolean;
  },
  options: Option
): Promise<void> => {
  const boundMessage = getBoundMessage(options.lang);
  const appId = manifest.app;
  let { retryCount, updateBody, updated } = status;

  try {
    if (!updateBody) {
      console.log(boundMessage("M_StartUploading"));
      try {
        const uploadFilesResult = await getUploadFilesResult(
          boundMessage,
          kintoneApiClient,
          manifest
        );

        updateBody = createUpdatedManifest(manifest, uploadFilesResult);
        console.log(boundMessage("M_FileUploaded"));
      } catch (error) {
        console.log(boundMessage("E_FileUploaded"));
        throw error;
      }
    }

    if (!updated) {
      try {
        await kintoneApiClient.updateCustomizeSetting(updateBody);
        console.log(boundMessage("M_Updated"));
        updated = true;
      } catch (error) {
        console.log(boundMessage("E_Updated"));
        throw error;
      }
    }

    try {
      await kintoneApiClient.deploySetting(appId);
      await kintoneApiClient.waitFinishingDeploy(appId, () =>
        console.log(boundMessage("M_Deploying"))
      );
      console.log(boundMessage("M_Deployed"));
    } catch (error) {
      console.log(boundMessage("E_Deployed"));
      throw error;
    }
  } catch (error) {
    const params = {
      error,
      manifest,
      updateBody,
      updated,
      retryCount,
      options,
      boundMessage,
      kintoneApiClient,
    };
    await handleUploadError(params);
  }
};

const getJsCssFiles = (manifest: JsCssManifest) => {
  return [
    manifest.desktop.js,
    manifest.desktop.css,
    manifest.mobile.js,
    manifest.mobile.css,
  ];
};

const getUploadFilesResult = async (
  boundMessage: (key: keyof typeof messages) => string,
  kintoneApiClient: KintoneApiClient,
  manifest: CustomizeManifest
) => {
  const uploadFilesResult = [];
  for (const files of getJsCssFiles(manifest)) {
    const results = [];
    for (const file of files) {
      const result = await kintoneApiClient.prepareCustomizeFile(file);
      if (result.type === "FILE") {
        console.log(`${file} ` + boundMessage("M_Uploaded"));
      }
      results.push(result);
    }
    uploadFilesResult.push(results);
  }

  return uploadFilesResult;
};

const createUpdatedManifest = (
  manifest: CustomizeManifest,
  uploadFilesResult: any
) => {
  return Object.assign({}, manifest, {
    desktop: {
      js: uploadFilesResult[0],
      css: uploadFilesResult[1],
    },
    mobile: {
      js: uploadFilesResult[2],
      css: uploadFilesResult[3],
    },
  });
};

const handleUploadError = async (params: HandleUploadErrorParameter) => {
  let {
    error,
    manifest,
    updateBody,
    updated,
    retryCount,
    options,
    boundMessage,
    kintoneApiClient,
  } = params;
  const isAuthenticationError = error instanceof AuthenticationError;
  retryCount++;
  if (isAuthenticationError) {
    throw new Error(boundMessage("E_Authentication"));
  } else if (retryCount < MAX_RETRY_COUNT) {
    await wait(1000);
    console.log(boundMessage("E_Retry"));
    await upload(
      kintoneApiClient,
      manifest,
      { retryCount, updateBody, updated },
      options
    );
  } else {
    throw error;
  }
};

export const run = async (params: InputParams): Promise<void> => {
  const {
    username,
    password,
    oAuthToken,
    basicAuthUsername,
    basicAuthPassword,
    baseUrl,
    manifestFile,
    options,
  } = params;
  const boundMessage = getBoundMessage(options.lang);

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
    baseUrl,
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
    console.log(boundMessage("M_Watching"));
    watcher.on("change", () =>
      upload(kintoneApiClient, manifest, status, options)
    );
  }
};

export * from "./import";
export * from "./init";
