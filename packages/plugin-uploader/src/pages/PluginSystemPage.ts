import type { Browser, Page } from "puppeteer";
import puppeteer from "puppeteer";
import type { Lang } from "../lang";
import chalk from "chalk";
import type { BoundMessage } from "../messages";
import { getBoundMessage } from "../messages";
import { ReactPluginSystemPage } from "./ReactPluginSystemPage";
import type { PluginSystemPageBase } from "./PluginSystemPageBase";
import {
  IMPORT_BUTTON_SELECTOR,
  OldPluginSystemPage,
} from "./OldPluginSystemPage";

const TIMEOUT_MS = 10000;
const DETECT_PAGE_TIMEOUT_MS = 10000;
const NO_PRIVILEGE_STATUS_CODE = "403";

export interface BasicAuth {
  username: string;
  password: string;
}

export class PluginSystemPage {
  private ui?: PluginSystemPageBase;
  private _page?: Page;

  public get page() {
    if (this._page === undefined) {
      throw new Error(
        "Page is not opened yet. Please call openNewPage() first.",
      );
    }
    return this._page;
  }

  public set page(value) {
    this._page = value;
  }

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

  public async openNewPage(browser: Browser) {
    this._page = await browser.newPage();
  }

  protected async login(options: {
    baseUrl: string;
    userName: string;
    password: string;
    boundMessage: BoundMessage;
    basicAuth?: BasicAuth;
  }): Promise<void> {
    const { baseUrl, userName, password, boundMessage, basicAuth } = options;
    const loginUrl = `${baseUrl}/login?saml=off`;

    if (basicAuth) {
      await this.page.authenticate(basicAuth);
    }

    console.log(`Open ${loginUrl}`);
    await this.page.goto(loginUrl);
    try {
      await this.page.waitForSelector(".form-username-slash", {
        timeout: TIMEOUT_MS,
      });
    } catch (e) {
      throw chalk.red(boundMessage("Error_cannotOpenLogin"));
    }

    console.log("Trying to log in...");
    await this.page.type(".form-username-slash > input.form-text", userName);
    await this.page.type(".form-password-slash > input.form-text", password);
    await this.page.click(".login-button");

    try {
      await this.page.waitForNavigation({
        timeout: TIMEOUT_MS,
        waitUntil: "domcontentloaded",
      });
    } catch (e) {
      throw chalk.red(boundMessage("Error_failedLogin"));
    }
  }

  protected goToPluginSystemPage(baseUrl: string) {
    const pluginSystemPageUri = `${baseUrl}/k/admin/system/plugin/`;
    console.log(`Navigate to ${pluginSystemPageUri}`);
    return this.page.goto(pluginSystemPageUri);
  }

  public launchBrowser(
    proxy?: string,
    ignoreDefaultArgs?: string[],
  ): Promise<Browser> {
    const args = proxy ? [`--proxy-server=${proxy}`] : [];
    return puppeteer.launch({ args, ignoreDefaultArgs, headless: "shell" });
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
    if (!response || response.headers().status === NO_PRIVILEGE_STATUS_CODE) {
      throw chalk.red(boundMessage("Error_adminPrivilege"));
    }

    await (await this.getUI()).readyForImportButton(this.page, boundMessage);
  }

  public async upload(pluginPath: string, lang: Lang): Promise<void> {
    await (await this.getUI()).upload(this.page, pluginPath, lang);
  }
}
