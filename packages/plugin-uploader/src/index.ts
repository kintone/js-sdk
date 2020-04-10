import chalk from "chalk";
import fs from "fs";
import puppeteer, { Browser, Page } from "puppeteer";

import { Lang } from "./lang";
import { getBoundMessage } from "./messages";

const TIMEOUT_MS = 5000;

async function launchBrowser(proxy?: string): Promise<Browser> {
  const args = proxy ? [`--proxy-server=${proxy}`] : [];
  return await puppeteer.launch({ args });
}

async function readyForUpload(
  browser: Browser,
  domain: string,
  userName: string,
  password: string,
  lang: Lang
): Promise<Page> {
  const m = getBoundMessage(lang);

  const page = await browser.newPage();
  const kintoneUrl = `https://${domain}/`;
  const loginUrl = `${kintoneUrl}login?saml=off`;
  console.log(`Open ${loginUrl}`);
  await page.goto(loginUrl);
  try {
    await page.waitFor(".form-username-slash", { timeout: TIMEOUT_MS });
  } catch (e) {
    console.log(chalk.red(m("Error_cannotOpenLogin")));
    process.exit(1);
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
    console.log(chalk.red(m("Error_failedLogin")));
    process.exit(1);
  }

  const pluginUrl = `${kintoneUrl}k/admin/system/plugin/`;
  console.log(`Navigate to ${pluginUrl}`);
  await page.goto(pluginUrl);
  try {
    await page.waitForSelector("#page-admin-system-plugin-index-addplugin", {
      timeout: TIMEOUT_MS,
    });
  } catch (e) {
    console.log(chalk.red(m("Error_adminPrivilege")));
    process.exit(1);
  }
  return page;
}

async function upload(
  page: Page,
  pluginPath: string,
  lang: Lang
): Promise<void> {
  const m = getBoundMessage(lang);
  console.log(`Trying to upload ${pluginPath}`);
  await page.click("#page-admin-system-plugin-index-addplugin");

  const file = await page.$('.plupload > input[type="file"]');
  if (file == null) {
    throw new Error('input[type="file"] cannot find');
  }
  await file.uploadFile(pluginPath);
  await page.click('button[name="ok"]');
  await page.waitForSelector(".ocean-ui-dialog", {
    hidden: true,
    timeout: TIMEOUT_MS,
  });
  console.log(`${pluginPath} ${m("Uploaded")}`);
}

interface Option {
  proxyServer?: string;
  watch?: boolean;
  lang: Lang;
}

export async function run(
  domain: string,
  userName: string,
  password: string,
  pluginPath: string,
  options: Option
): Promise<void> {
  let browser = await launchBrowser(options.proxyServer);
  let page: Page;
  const { lang } = options;
  const m = getBoundMessage(lang);
  try {
    page = await readyForUpload(browser, domain, userName, password, lang);
    await upload(page, pluginPath, lang);
    if (options.watch) {
      let uploading = false;
      fs.watch(pluginPath, async () => {
        if (uploading) {
          return;
        }
        try {
          uploading = true;
          await upload(page, pluginPath, lang);
        } catch (e) {
          console.log(e);
          console.log(m("Error_retry"));
          await browser.close();
          browser = await launchBrowser(options.proxyServer);
          page = await readyForUpload(
            browser,
            domain,
            userName,
            password,
            lang
          );
          await upload(page, pluginPath, lang);
        } finally {
          uploading = false;
        }
      });
    } else {
      await browser.close();
    }
  } catch (e) {
    console.error(m("Error"), e);
    await browser.close();
  }
}
