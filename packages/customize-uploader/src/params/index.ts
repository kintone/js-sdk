import * as inquirer from "inquirer";
import type { Lang } from "../lang";
import { getBoundMessage } from "../messages";
import { promptForBaseUrl, promptForPassword, promptForUsername } from "./prompts";
import { promises } from "fs";

interface Params {
  username?: string;
  password?: string;
  oAuthToken?: string;
  baseUrl?: string;
  lang: Lang;
}

const isSet = (v: string|null|undefined) => typeof(v) === "string";

export const inquireParams = async ({
  username,
  password,
  baseUrl,
  lang,
  oAuthToken,
}: Params) => {
  const m = getBoundMessage(lang);
  baseUrl = isSet(baseUrl) ? await promptForBaseUrl(m, baseUrl) : baseUrl;
  username = isSet(oAuthToken) && isSet(username) ? await promptForUsername(m, username) : username;
  password = isSet(oAuthToken) && isSet(password) ? await promptForPassword(m, password) : password;

  return {
    username,
    password,
    baseUrl,
  }
};

export * from "./init";
