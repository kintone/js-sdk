import { Lang } from "./lang";

type LangMap = { [lang in Lang]: string };
type MessageMap = { [key in keyof typeof messages]: LangMap };

const messages = {
  Q_BaseUrl: {
    en: "Input your kintone's base URL (https://example.cybozu.com):",
    ja: "kintoneのベースURLを入力してください (https://example.cybozu.com):",
  },
  Q_UserName: {
    en: "Input your username:",
    ja: "ログイン名を入力してください:",
  },
  Q_Password: {
    en: "Input your password:",
    ja: "パスワードを入力してください:",
  },
  Error: {
    en: "An error occured",
    ja: "エラーが発生しました",
  },
  Error_retry: {
    en: "An error occured, retry with a new browser",
    ja: "エラーが発生しました。リトライします",
  },
  Error_requiredZipPath: {
    en: "Please specify the path of the Kintone plug-in zip file",
    ja: "kintoneプラグインのzipへのパスを指定してください",
  },
  Error_failedLogin: {
    en: "Login failed, please confirm your username and password",
    ja: "kintoneへのログインに失敗しました。ログイン名とパスワードを確認してください",
  },
  Error_cannotOpenLogin: {
    en: "Cannot find a login form on the specified page, please confirm the subdomain",
    ja: "指定されたページにログインフォームが見つかりませんでした。ドメインを確認してください",
  },
  Error_adminPrivilege: {
    en: "Cannot navigate to the plug-ins page, please retry with an account with administrator privileges",
    ja: "kintone管理者権限のあるユーザーで実行してください",
  },
  Uploaded: {
    en: "has been uploaded!",
    ja: "をアップロードしました!",
  },
};

/**
 * Returns a message for the passed lang and key
 * @param lang
 * @param key
 */
export const getMessage = (
  lang: keyof LangMap,
  key: keyof MessageMap
): string => {
  return messages[key][lang];
};

/**
 * Returns a function bound lang to getMessage
 * @param lang
 */
export const getBoundMessage = (
  lang: keyof LangMap
): ((key: keyof MessageMap) => string) => {
  return getMessage.bind(null, lang);
};
