import fs from "fs";
import puppeteer, { Browser, Page } from "puppeteer";

async function launchBrowser(proxy?: string): Promise<Browser> {
  const args = proxy ? [`--proxy-server=${proxy}`] : [];
  return await puppeteer.launch({ args });
}

async function readyForUpload(
  browser: Browser,
  domain: string,
  userName: string,
  password: string
): Promise<Page> {
  const page = await browser.newPage();
  const kintoneUrl = `https://${domain}/`;
  const loginUrl = `${kintoneUrl}login?saml=off`;
  console.log(`Open ${loginUrl}`);
  await page.goto(loginUrl);

  await page.waitFor(".form-username-slash");
  console.log("Try to logged-in...");
  await page.type(".form-username-slash > input.form-text", userName);
  await page.type(".form-password-slash > input.form-text", password);
  await page.click(".login-button");
  await page.waitForNavigation();

  const pluginUrl = `${kintoneUrl}k/admin/system/plugin/`;
  console.log(`Navigate to ${pluginUrl}`);
  await page.goto(pluginUrl);
  return page;
}

async function upload(page: Page, pluginPath: string): Promise<void> {
  console.log(`Try to upload ${pluginPath}`);
  await page.click("#page-admin-system-plugin-index-addplugin");

  const file = await page.$('.plupload > input[type="file"]');
  if (file == null) {
    throw new Error('input[type="file"] cannot find');
  }
  await file.uploadFile(pluginPath);
  await page.click('button[name="ok"]');
  await page.waitForSelector(".ocean-ui-dialog", {
    hidden: true,
    timeout: 5000
  });
  console.log(`${pluginPath} has been uploaded!`);
}

interface Option {
  proxyServer?: string;
  watch?: boolean;
}

export async function run(
  domain: string,
  userName: string,
  password: string,
  pluginPath: string,
  options: Option = {}
): Promise<void> {
  let browser = await launchBrowser(options.proxyServer);
  let page: Page;
  try {
    page = await readyForUpload(browser, domain, userName, password);
    await upload(page, pluginPath);
    if (options.watch) {
      let uploading = false;
      fs.watch(pluginPath, async () => {
        if (uploading) {
          return;
        }
        try {
          uploading = true;
          await upload(page, pluginPath);
        } catch (e) {
          console.log(e);
          console.log("An error occured, retry with a new browser");
          await browser.close();
          browser = await launchBrowser(options.proxyServer);
          page = await readyForUpload(browser, domain, userName, password);
          await upload(page, pluginPath);
        } finally {
          uploading = false;
        }
      });
    } else {
      await browser.close();
    }
  } catch (e) {
    console.error("An error occured", e);
    await browser.close();
  }
}
