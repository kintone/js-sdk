import { LoginUser } from "../js-api/general.js";

export type General = {
  // https://cybozu.dev/ja/kintone/docs/js-api/kintone/user/
  getLoginUser(): LoginUser;
  // https://cybozu.dev/ja/kintone/docs/js-api/kintone/get-design/
  getUiVersion(): 1 | 2;
  // https://cybozu.dev/ja/kintone/docs/js-api/api/get-csrf-token/
  getRequestToken(): string;
  // https://cybozu.dev/ja/id/76c0f6daa0367b055a444f93/#files-pc-js
  $PLUGIN_ID: string;
};
