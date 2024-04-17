import fs from "fs";

import { getBoundMessage } from "./messages";
import type { BasicAuth } from "./pluginSystemPage";
import { PluginSystemPage } from "./pluginSystemPage";
import type { Lang } from "./lang";

export interface Option {
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
  const pluginSystemPage = new PluginSystemPage();
  let browser = await pluginSystemPage.launchBrowser(
    options.proxyServer,
    options.puppeteerIgnoreDefaultArgs,
  );

  const { lang, basicAuth } = options;
  const boundMessage = getBoundMessage(lang);

  const params = {
    browser,
    baseUrl,
    userName,
    password,
    lang,
    basicAuth,
  };
  try {
    let page = await pluginSystemPage.readyForUpload(params);
    await pluginSystemPage.upload(page, pluginPath, lang);
    if (options.watch) {
      let uploading = false;
      fs.watch(pluginPath, async () => {
        if (uploading) {
          return;
        }
        try {
          uploading = true;
          await pluginSystemPage.upload(page, pluginPath, lang);
        } catch (e) {
          console.log(e);
          console.log(boundMessage("Error_retry"));
          await browser.close();
          browser = await pluginSystemPage.launchBrowser(options.proxyServer);
          page = await pluginSystemPage.readyForUpload({
            browser,
            baseUrl,
            userName,
            password,
            lang,
            basicAuth,
          });
          await pluginSystemPage.upload(page, pluginPath, lang);
        } finally {
          uploading = false;
        }
      });
    } else {
      await browser.close();
    }
  } catch (e) {
    console.error(boundMessage("Error"), e);
    await browser.close();
  }
};
