import fs from 'fs';
import puppeteer, { Browser, Page } from 'puppeteer';

async function init(
  domain: string,
  userName: string,
  password: string,
  proxy?: string
): Promise<[Browser, Page]> {
  const args = proxy ? [`--proxy-server=${proxy}`] : [];
  const browser = await puppeteer.launch({ args });
  const page = await browser.newPage();
  const kintoneUrl = `https://${domain}/`;
  try {
    console.log(`Open ${kintoneUrl}`);
    await page.goto(`${kintoneUrl}login?saml=off`);

    await page.waitFor('.form-username-slash');
    console.log('Try to logged-in...');
    await page.type('.form-username-slash > input.form-text', userName);
    await page.type('.form-password-slash > input.form-text', password);
    await page.click('.login-button');
    await page.waitForNavigation();

    const pluginUrl = `${kintoneUrl}k/admin/system/plugin/`;
    console.log(`Navigate to ${pluginUrl}`);
    await page.goto(pluginUrl);
  } catch (e) {
    console.error('An error occured', e);
    browser.close();
  }

  return [browser, page];
}

let uploading = false;

async function upload(
  browser: Browser,
  page: Page,
  pluginPath: string
): Promise<void> {
  uploading = true;
  try {
    console.log(`Try to upload ${pluginPath}`);
    await page.click('#page-admin-system-plugin-index-addplugin');

    const file = await page.$('.plupload > input[type="file"]');
    if (file == null) {
      throw new Error('input[type="file"] cannot find');
    }
    await file.uploadFile(pluginPath);
    await page.click('button[name="ok"]');
    await page.waitForSelector('.ocean-ui-dialog', { hidden: true });
    console.log(`${pluginPath} has been uploaded!`);
  } catch (e) {
    console.error('An error occured', e);
    await browser.close();
  } finally {
    uploading = false;
  }
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
  const [browser, page] = await init(
    domain,
    userName,
    password,
    options.proxyServer
  );
  await upload(browser, page, pluginPath);
  if (options.watch) {
    fs.watch(pluginPath, () => {
      if (!uploading) {
        upload(browser, page, pluginPath);
      }
    });
  } else {
    await browser.close();
  }
}
