import type { Page } from "puppeteer";
import type { BoundMessage } from "./messages";
import { getBoundMessage } from "./messages";
import chalk from "chalk";
import type { Lang } from "./lang";
import type { PageInterface } from "./PageInterface";

const TIMEOUT_MS = 15000;
const UPLOAD_TIMEOUT_MS = 60000;

const IMPORT_BUTTON_SELECTOR = "button[data-testid='PluginImportButton']";
const FILE_SELECTOR = "label[data-testid='FileSelector'] > input[type='file']";
const IMPORT_DIALOG_SELECTOR = "div[data-testid='ImportDialog']";
const IMPORT_BUTTON_IN_DIALOG_SELECTOR =
  "//div[@data-testid='ImportDialog']//div[contains(@class,'_footer')]//button[1]";

export class ReactPage implements PageInterface {
  public async readyForImportButton(
    page: Page,
    boundMessage: BoundMessage,
  ): Promise<void> {
    try {
      await page.waitForSelector(IMPORT_BUTTON_SELECTOR, {
        timeout: TIMEOUT_MS,
      });
    } catch (e) {
      throw chalk.blue(boundMessage("Error_notDisplayImportButton"));
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

    const file = await page.$(FILE_SELECTOR);
    if (file == null) {
      throw new Error('input[type="file"] is not found');
    }
    await file.uploadFile(pluginPath);

    await page.click(`xpath/${IMPORT_BUTTON_IN_DIALOG_SELECTOR}`);

    await page.waitForSelector(`xpath/${IMPORT_BUTTON_IN_DIALOG_SELECTOR}`, {
      hidden: true,
      timeout: UPLOAD_TIMEOUT_MS,
    });
    console.log(`${pluginPath} ${boundMessage("Uploaded")}`);
  }
}