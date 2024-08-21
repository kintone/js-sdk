import type { Lang } from "../lang";
import { getBoundMessage } from "../messages";
import {
  promptForBaseUrl,
  promptForPassword,
  promptForUsername,
} from "./prompts";

interface Params {
  username?: string;
  password?: string;
  oAuthToken?: string;
  baseUrl?: string;
  lang: Lang;
}

const isSet = (v: string | null | undefined) => typeof v === "string";

export const inquireParams = async ({
  username,
  password,
  baseUrl,
  lang,
  oAuthToken,
}: Params) => {
  const m = getBoundMessage(lang);
  const _baseUrl = isSet(baseUrl) ? baseUrl : await promptForBaseUrl(m);
  const _username =
    isSet(oAuthToken) || isSet(username)
      ? username
      : await promptForUsername(m);
  const _password =
    isSet(oAuthToken) || isSet(password)
      ? password
      : await promptForPassword(m);

  return {
    username: _username,
    password: _password,
    baseUrl: _baseUrl,
  };
};

export * from "./init";
