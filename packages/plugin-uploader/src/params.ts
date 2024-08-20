import type { Lang } from "./lang";
import { getBoundMessage } from "./messages";
import {
  promptForBaseUrl,
  promptForPassword,
  promptForUsername,
} from "./prompts/params";

interface Params {
  username?: string;
  password?: string;
  baseUrl?: string;
  lang: Lang;
}

const isSet = (v: string | null | undefined) => typeof v === "string";

export const inquireParams = async ({
  username,
  password,
  baseUrl,
  lang,
}: Params): Promise<{
  username: string;
  password: string;
  baseUrl: string;
}> => {
  const m = getBoundMessage(lang);

  const _baseUrl = isSet(baseUrl) ? baseUrl : await promptForBaseUrl(m);
  const _username = isSet(username) ? username : await promptForUsername(m);
  const _password = isSet(password) ? password : await promptForPassword(m);

  return {
    baseUrl: _baseUrl,
    username: _username,
    password: _password,
  };
};
