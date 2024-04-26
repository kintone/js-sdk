import type { Lang } from "../lang";
import chalk from "chalk";
import { getBoundMessage } from "../messages";
import { ReactPluginSystemPage } from "../pages/ReactPluginSystemPage";
import type { PluginSystemPageInterface } from "../pages/PluginSystemPageInterface";
import {
  IMPORT_BUTTON_SELECTOR,
  OldPluginSystemPage,
} from "../pages/OldPluginSystemPage";
import { ControllerBase } from "./ControllerBase";

const DETECT_PAGE_TIMEOUT_MS = 10000;
const NO_PRIVILEGE_STATUS_CODE = "CB_NO02";

export interface BasicAuth {
  username: string;
  password: string;
}

export default class PluginSystemController extends ControllerBase {
  private ui?: PluginSystemPageInterface;

  private async getUI() {
    if (this.ui) {
      return this.ui;
    }

    const isReactPage = await this.isReactPage();
    this.ui = isReactPage
      ? new ReactPluginSystemPage()
      : new OldPluginSystemPage();

    return this.ui;
  }

  private async isReactPage(): Promise<boolean> {
    try {
      await this.page.waitForSelector(IMPORT_BUTTON_SELECTOR, {
        timeout: DETECT_PAGE_TIMEOUT_MS,
      });
      return false;
    } catch (e) {
      return true;
    }
  }

  protected async goToPluginSystemPage(baseUrl: string) {
    const pluginSystemPageUri = `${baseUrl}/k/admin/system/plugin/`;
    console.log(`Navigate to ${pluginSystemPageUri}`);
    return this.page.goto(pluginSystemPageUri);
  }

  public async readyForUpload(options: {
    baseUrl: string;
    userName: string;
    password: string;
    lang: Lang;
    basicAuth?: BasicAuth;
  }): Promise<void> {
    const { baseUrl, userName, password, lang, basicAuth } = options;
    const boundMessage = getBoundMessage(lang);

    await this.login({
      baseUrl,
      userName,
      password,
      boundMessage,
      basicAuth,
    });

    const response = await this.goToPluginSystemPage(baseUrl);
    if (
      !response ||
      (response.headers()["x-cybozu-error"] &&
        response.headers()["x-cybozu-error"] === NO_PRIVILEGE_STATUS_CODE)
    ) {
      throw chalk.red(boundMessage("Error_adminPrivilege"));
    }

    await (await this.getUI()).readyForImportButton(this.page, boundMessage);
  }

  public async upload(pluginPath: string, lang: Lang): Promise<void> {
    await (await this.getUI()).upload(this.page, pluginPath, lang);
  }
}
