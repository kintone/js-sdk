import type { Lang } from "../lang";
import { getBoundMessage } from "../messages";
import { promptForAppId, promptForScope } from "./prompts/init";

export const inquireInitParams = async (lang: Lang) => {
  const m = getBoundMessage(lang);
  const appId = await promptForAppId(m);
  const scope = await promptForScope(m);
  return { appId, scope, lang };
};
