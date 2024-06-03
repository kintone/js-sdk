import fs from "fs";
import { getBoundMessage } from "./messages";
import type { BasicAuth } from "./controllers/ControllerBase";
import PluginSystemController from "./controllers/PluginSystemController";
import type { Lang } from "./lang";

interface Option {
  proxyServer?: string;
  watch?: boolean;
  lang: Lang;
  basicAuth?: BasicAuth;
  puppeteerIgnoreDefaultArgs?: string[];
}

export const run = async (
  baseUrl: string,
  userName: string,
  password: string,
  pluginPath: string,
  options: Option,
): Promise<void> => {
  const { lang, basicAuth } = options;
  const boundMessage = getBoundMessage(lang);

  const browserOptions = {
    proxy: options.proxyServer,
    ignoreDefaultArgs: options.puppeteerIgnoreDefaultArgs,
  };
  const pluginSystemController = new PluginSystemController();
  await pluginSystemController.launchBrowser(browserOptions);

  try {
    await pluginSystemController.openNewPage();
    await pluginSystemController.readyForUpload({
      baseUrl,
      userName,
      password,
      lang,
      basicAuth,
    });
    await pluginSystemController.upload(pluginPath, lang);
    if (options.watch) {
      let uploading = false;
      fs.watch(pluginPath, async () => {
        if (uploading) {
          return;
        }
        try {
          uploading = true;
          await pluginSystemController.upload(pluginPath, lang);
        } catch (e) {
          console.log(e);
          console.log(boundMessage("Error_retry"));
          await pluginSystemController.closeBrowser();
          await pluginSystemController.launchBrowser(browserOptions);
          await pluginSystemController.openNewPage();
          await pluginSystemController.readyForUpload({
            baseUrl,
            userName,
            password,
            lang,
            basicAuth,
          });
          await pluginSystemController.upload(pluginPath, lang);
        } finally {
          // eslint-disable-next-line require-atomic-updates
          uploading = false;
        }
      });
    } else {
      await pluginSystemController.closeBrowser();
    }
  } catch (e) {
    console.error(boundMessage("Error"), e);
    await pluginSystemController.closeBrowser();

    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
};
