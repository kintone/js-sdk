import fs from "fs";
import { getBoundMessage } from "./messages";
import type { BasicAuth } from "./controllers/ControllerBase";
import PluginSystemController from "./controllers/PluginSystemController";
import type { Lang } from "./lang";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";

interface Option {
  proxyServer?: string;
  watch?: boolean;
  lang: Lang;
  basicAuth?: BasicAuth;
}

export const run = async (
  baseUrl: string,
  userName: string,
  password: string,
  pluginPath: string,
  options: Option,
): Promise<void> => {
  const { lang, basicAuth, proxyServer } = options;
  const boundMessage = getBoundMessage(lang);

  const apiClient = new KintoneRestAPIClient({
    baseUrl,
    auth: { username: userName, password: password },
    basicAuth: basicAuth,
    userAgent: `${packageJson.name}@${packageJson.version}`,
    // TODO: プロキシサポート
  });

  // cli-kintone plugin installコマンド使ってもらうほうが良さそう

  try {
    if (options.watch) {
      fs.watch(pluginPath, async () => {
        try {
        } catch (e) {
          console.log(e);
          console.log(boundMessage("Error_retry"));
        }
      });
    }
  } catch (e) {
    console.error(boundMessage("Error"), e);

    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }
};
