import type { Page } from "puppeteer";
import type { BoundMessage } from "../messages";
import { getBoundMessage } from "../messages";
import chalk from "chalk";
import type { Lang } from "../lang";
import type { PluginSystemPageInterface } from "./PluginSystemPageInterface";

const TIMEOUT_MS = 10000;
const UPLOAD_TIMEOUT_MS = 60000;

export const IMPORT_BUTTON_SELECTOR =
  "#page-admin-system-plugin-index-addplugin";
const IMPORT_PLUGIN_DIALOG_SELECTOR = ".ocean-ui-dialog";
const FILE_SELECTOR = '.plupload > input[type="file"]';

export class OldPluginSystemPage implements PluginSystemPageInterface {
  public async readyForImportButton(
    page: Page,
    boundMessage: BoundMessage,
  ): Promise<void> {
    try {
      await page.waitForSelector(IMPORT_BUTTON_SELECTOR, {
        timeout: TIMEOUT_MS,
      });
    } catch (e) {
      throw chalk.red(boundMessage("Error_notDisplayImportButton"));
    }
  }

  public async upload(
    page: Page,
    pluginPath: string,
    lang: Lang,
  ): Promise<void> {
    const boundMessage = getBoundMessage(lang);
    console.log(`Trying to upload ${pluginPath}`);
    await page.click(IMPORT_BUTTON_SELECTOR);
    await page.waitForSelector(IMPORT_PLUGIN_DIALOG_SELECTOR, {
      timeout: TIMEOUT_MS,
    });
    const file = await page.$(FILE_SELECTOR);
    if (file === null) {
      throw new Error('input[type="file"] is not found');
    }
    await file.uploadFile(pluginPath);
    // HACK: `page.click` does not work as expected, so we use `page.evaluate` instead.
    // ref: https://github.com/puppeteer/puppeteer/pull/7097#issuecomment-850348366
    await page.evaluate(() => {
      const button =
        document.querySelector<HTMLButtonElement>('button[name="ok"]');
      if (button) {
        button.click();
      } else {
        throw new Error('button[name="ok"] is not found');
      }
    });

    await page.waitForSelector(".ocean-ui-dialog", {
      hidden: true,
      timeout: UPLOAD_TIMEOUT_MS,
    });
    console.log(`${pluginPath} ${boundMessage("Uploaded")}`);
  }
}
