import type { Browser, Page } from "puppeteer";
import puppeteer from "puppeteer";
import chalk from "chalk";
import type { BoundMessage } from "../messages";

const TIMEOUT_MS = 10000;

export interface BasicAuth {
  username: string;
  password: string;
}

export abstract class ControllerBase {
  private _browser?: Browser;
  private _page?: Page;

  public get browser() {
    if (this._browser === undefined) {
      throw new Error(
        "Browser is not launched yet. Please call launchBrowser() first.",
      );
    }
    return this._browser;
  }

  public set browser(value) {
    this._browser = value;
  }

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

  public async launchBrowser(
    options: {
      proxy?: string;
      ignoreDefaultArgs?: string[];
    } = {},
  ) {
    const args = options.proxy ? [`--proxy-server=${options.proxy}`] : [];
    this._browser = await puppeteer.launch({
      args,
      ignoreDefaultArgs: options.ignoreDefaultArgs,
      headless: "shell",
    });
  }

  public async closeBrowser() {
    return this.browser.close();
  }

  public async openNewPage() {
    this._page = await this.browser.newPage();
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
}
