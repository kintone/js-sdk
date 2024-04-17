import type { Browser, Page } from "puppeteer";
import puppeteer from "puppeteer";
import type { Lang } from "./lang";
import chalk from "chalk";
import type { BoundMessage } from "./messages";
import { getBoundMessage } from "./messages";
import { ReactPage } from "./reactPage";
import type { PageInterface } from "./PageInterface";
import { IMPORT_BUTTON_SELECTOR, OldPage } from "./oldPage";

const TIMEOUT_MS = 10000;
const DETECT_PAGE_TIMEOUT_MS = 10000;
const NO_PRIVILEGE_STATUS_CODE = "403";

export interface BasicAuth {
  username: string;
  password: string;
}

export class PluginSystemPage {
  private static ui?: PageInterface;

  static async getUI(page: Page) {
    if (PluginSystemPage.ui) {
      return PluginSystemPage.ui;
    }

    PluginSystemPage.ui = (await this.isReactPage(page))
      ? new ReactPage()
      : new OldPage();

    return PluginSystemPage.ui;
  }

  private static async isReactPage(page: Page): Promise<boolean> {
    try {
      await page.waitForSelector(IMPORT_BUTTON_SELECTOR, {
        timeout: DETECT_PAGE_TIMEOUT_MS,
      });
      return false;
    } catch (e) {
      return true;
    }
  }

  protected async login(options: {
    baseUrl: string;
    userName: string;
    password: string;
    page: Page;
    boundMessage: BoundMessage;
    basicAuth?: BasicAuth;
  }): Promise<void> {
    const { baseUrl, userName, password, page, boundMessage, basicAuth } =
      options;
    const loginUrl = `${baseUrl}/login?saml=off`;

    if (basicAuth) {
      await page.authenticate(basicAuth);
    }

    console.log(`Open ${loginUrl}`);
    await page.goto(loginUrl);
    try {
      await page.waitForSelector(".form-username-slash", {
        timeout: TIMEOUT_MS,
      });
    } catch (e) {
      throw chalk.red(boundMessage("Error_cannotOpenLogin"));
    }

    console.log("Trying to log in...");
    await page.type(".form-username-slash > input.form-text", userName);
    await page.type(".form-password-slash > input.form-text", password);
    await page.click(".login-button");

    try {
      await page.waitForNavigation({
        timeout: TIMEOUT_MS,
        waitUntil: "domcontentloaded",
      });
    } catch (e) {
      throw chalk.red(boundMessage("Error_failedLogin"));
    }
  }

  protected goToPluginSystemPage(baseUrl: string, page: Page) {
    const pluginUrl = `${baseUrl}/k/admin/system/plugin/`;
    console.log(`Navigate to ${pluginUrl}`);
    return page.goto(pluginUrl);
  }

  public launchBrowser(
    proxy?: string,
    ignoreDefaultArgs?: string[],
  ): Promise<Browser> {
    const args = proxy ? [`--proxy-server=${proxy}`] : [];
    return puppeteer.launch({ args, ignoreDefaultArgs, headless: "shell" });
  }

  async readyForUpload(options: {
    browser: Browser;
    baseUrl: string;
    userName: string;
    password: string;
    lang: Lang;
    basicAuth?: BasicAuth;
  }): Promise<Page> {
    const { browser, baseUrl, userName, password, lang, basicAuth } = options;
    const boundMessage = getBoundMessage(lang);
    const page = await browser.newPage();

    await this.login({
      baseUrl,
      userName,
      password,
      page,
      boundMessage,
      basicAuth,
    });

    const response = await this.goToPluginSystemPage(baseUrl, page);
    if (!response || response.headers().status === NO_PRIVILEGE_STATUS_CODE) {
      throw chalk.red(boundMessage("Error_adminPrivilege"));
    }

    await (
      await PluginSystemPage.getUI(page)
    ).readyForImportButton(page, boundMessage);

    return page;
  }

  public async upload(
    page: Page,
    pluginPath: string,
    lang: Lang,
  ): Promise<void> {
    await (await PluginSystemPage.getUI(page)).upload(page, pluginPath, lang);
  }
}
