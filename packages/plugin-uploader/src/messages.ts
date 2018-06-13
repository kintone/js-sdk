"use strict";

import { Lang } from "./lang";

type LangMap = { [lang in Lang]: string };
type MessageMap = { [key in keyof typeof messages]: LangMap };

const messages = {
  Q_Domain: {
    en: "Input your kintone's domain (example.cybozu.com):",
    ja: "kintoneのドメインを入力してください (example.cybozu.com):"
  },
  Q_UserName: {
    en: "Input your username:",
    ja: "ログイン名を入力してください:"
  },
  Q_Password: {
    en: "Input your password:",
    ja: "パスワードを入力してください:"
  },
  Error: {
    en: "An error occured",
    ja: "エラーが発生しました"
  },
  Error_retry: {
    en: "An error occured, retry with a new browser",
    ja: "エラーが発生しました。リトライします"
  },
  Error_requiredZipPath: {
    en: "Please specify the path of kintone plugin zip",
    ja: "kintoneプラグインのzipへのパスを指定してください"
  },
  Error_failedLogin: {
    en: "Error: Login was failed, please confirm your username and password",
    ja:
      "エラー: kintoneへのログインに失敗しました。ログイン名とパスワードを確認してください"
  },
  Error_adminPrivilege: {
    en:
      "Error: Cannot navigate to the plugin-ins page, please retry with an account having the administrator privilege",
    ja: "エラー: kintone管理者権限のあるユーザーで実行してください"
  },
  Uploaded: {
    en: "has been uploaded!",
    ja: "をアップロードしました!"
  }
};

/**
 * Returns a message for the passed lang and key
 * @param lang
 * @param key
 */
export function getMessage(lang: keyof LangMap, key: keyof MessageMap): string {
  return messages[key][lang];
}

/**
 * Returns a function bound lang to getMessage
 * @param lang
 */
export function getBoundMessage(
  lang: keyof LangMap
): (key: keyof MessageMap) => string {
  return getMessage.bind(null, lang);
}
