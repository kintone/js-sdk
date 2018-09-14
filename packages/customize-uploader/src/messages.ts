import { Lang } from "./lang";

type LangMap = { [lang in Lang]: string };
type MessageMap = { [key in keyof typeof messages]: LangMap };

const messages = {
  E_requiredManifestFile: {
    en: "Please specify manifest file",
    ja: "マニフェストファイルを指定してください"
  },
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
  M_FileUploaded: {
    en: "JavaScript/CSS files have been uploaded!",
    ja: "JavaScript/CSS ファイルをアップロードしました!"
  },
  E_FileUploaded: {
    en: "Failed to upload JavaScript/CSS files",
    ja: "JavaScript/CSS ファイルのアップロードに失敗しました"
  },
  M_Uploaded: {
    en: "has been uploaded!",
    ja: "をアップロードしました!"
  },
  M_Updated: {
    en: "Customize setting has been updated!",
    ja: "JavaScript/CSS カスタマイズの設定を変更しました!"
  },
  E_Updated: {
    en: "Failed to update customize setting",
    ja: "JavaScript/CSS カスタマイズの設定の変更に失敗しました"
  },
  M_Deployed: {
    en: "Setting has been deployed!",
    ja: "運用環境に反映しました!"
  },
  E_Authentication: {
    en:
      "Failed to authenticate. Please confirm your username and password and domain",
    ja: "認証に失敗しました。ログイン名、パスワード、ドメインを確認してください"
  },
  E_Deployed: {
    en: "Failed to deploy setting",
    ja: "運用環境への反映に失敗しました"
  },
  M_Deploying: {
    en: "Wait for deploying completed...",
    ja: "運用環境への反映の完了を待っています..."
  },
  M_Watching: {
    en: "Watcing for file changes...",
    ja: "ファイルの変更を監視しています..."
  },
  E_Retry: {
    en: "An error occured, retry",
    ja: "エラーが発生しました。リトライします"
  },
  E_Exit: {
    en:
      "An error occured, exit process. Please check if you passed proper arguments and manifest file",
    ja:
      "エラーが発生しました。引数の値と、マニフェストファイルに正しい値が入力されているか確認してください"
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
