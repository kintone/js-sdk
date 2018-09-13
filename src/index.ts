import chokidar from "chokidar";
import fs from "fs";
import { getBoundMessage } from "./messages";
import { DeploySetting, DeployStatus, UpdateCustomizeSetting } from "./request";
import { Option } from "./util";
import { getCustomizeUploadParams, getXCybozuAuthorization } from "./util";

async function upload(
  auth: string,
  kintoneUrl: string,
  manifest: {
    [propName: string]: any;
  },
  status: {
    count: number;
    running: boolean;
    uploaded: boolean;
    updated: boolean;
    deployed: boolean;
  },
  options: Option
): Promise<void> {
  const m = getBoundMessage(options.lang);
  const appId = manifest.app;
  let { count, running, uploaded, updated, deployed } = status;

  let successed = false;
  // Stop running multiple times as "change" event will be fired as many times as the number of files in watching path
  if (running) {
    return;
  }
  try {
    running = true;

    const updateBody = JSON.parse(JSON.stringify(manifest));
    if (!uploaded) {
      try {
        updateBody.desktop.js = await getCustomizeUploadParams(
          auth,
          kintoneUrl,
          manifest.desktop.js,
          "text/javascript",
          options
        );
        updateBody.desktop.css = await getCustomizeUploadParams(
          auth,
          kintoneUrl,
          manifest.desktop.css,
          "text/css",
          options
        );
        updateBody.mobile.js = await getCustomizeUploadParams(
          auth,
          kintoneUrl,
          manifest.mobile.js,
          "text/javascript",
          options
        );
        console.log(m("M_FileUploaded"));
        uploaded = true;
      } catch (e) {
        console.log(m("E_FileUploaded"));
        throw new Error(e);
      }
    }

    if (!updated) {
      try {
        await new UpdateCustomizeSetting(
          auth,
          kintoneUrl,
          updateBody,
          options
        ).send();
        console.log(m("M_Updated"));
        updated = true;
      } catch (e) {
        console.log(m("E_Updated"));
        throw new Error(e);
      }
    }

    if (!deployed) {
      try {
        await new DeploySetting(auth, kintoneUrl, appId, options).send();
        await new DeployStatus(auth, kintoneUrl, appId, options).check();
        console.log(m("M_Deployed"));
        deployed = true;
      } catch (e) {
        console.log(m("E_Deployed"));
        throw new Error(e);
      }
    }

    successed = true;
  } catch (e) {
    console.log(e);
    console.log(m("E_Retry"));
  } finally {
    count++;
    running = false;
    status = { count, running, uploaded, updated, deployed };

    if (!successed && count < 3) {
      await new Promise(r => setTimeout(r, 1000));
      await upload(auth, kintoneUrl, manifest, status, options);
    } else if (!successed) {
      console.log(m("E_Exit"));
    }
  }
}

export const run = async (
  domain: string,
  username: string,
  password: string,
  manifestFile: string,
  options: Option
): Promise<void> => {
  const m = getBoundMessage(options.lang);

  const auth = getXCybozuAuthorization(username, password);
  const kintoneUrl =
    domain.indexOf("https://") > -1 ? domain : `https://${domain}`;
  const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
  const status = {
    count: 0,
    running: false,
    uploaded: false,
    updated: false,
    deployed: false
  };

  const exp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/gi;
  const regexp = new RegExp(exp);
  const filesArray: [string] = manifest.desktop.js.concat(
    manifest.desktop.css,
    manifest.mobile.js
  );
  const files = filesArray.filter(fileOrPath => {
    return !fileOrPath.match(regexp);
  });

  await upload(auth, kintoneUrl, manifest, status, options);

  if (options.watch) {
    const watcher = chokidar.watch(files, {
      // Avoid that multiple change events were fired depending on which OS or text editors you are using with
      // Note that there would be higher possibility to get errors if you set smaller value of 'stabilityThreshold'
      awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100
      }
    });
    console.log(m("M_Watching"));
    watcher.on("change", async () => {
      await upload(auth, kintoneUrl, manifest, status, options);
    });
  }
};
