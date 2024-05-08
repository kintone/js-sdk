import type { BoundMessage } from "../messages";
import type { Page } from "puppeteer";
import type { Lang } from "../lang";

export interface PluginSystemPageInterface {
  readyForImportButton(page: Page, m: BoundMessage): Promise<void>;
  upload(page: Page, pluginPath: string, lang: Lang): Promise<void>;
}
