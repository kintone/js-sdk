export const kintoneJsApis = [
  // イベントハンドラーを登録する
  "kintone.events.on",
  "kintone.events.on",

  // イベントハンドラーを削除する
  "kintone.events.off",
  "kintone.events.off",

  // kintone REST APIリクエストを送信する
  "kintone.api",
  "kintone.api",

  // APIのURLを取得する
  "kintone.api.url",
  "kintone.api.url",

  // クエリ文字列付きのAPIのURLを取得する
  "kintone.api.urlForGet",
  "kintone.api.urlForGet",

  // CSRFトークンを取得する
  "kintone.getRequestToken",
  "kintone.getRequestToken",

  // kintone REST API同時接続数を取得する
  "kintone.api.getConcurrencyLimit",
  "kintone.api.getConcurrencyLimit",

  // 外部のAPIを実行する
  "kintone.proxy",
  "kintone.proxy",

  // 外部にファイルをアップロードする
  "kintone.proxy.upload",
  "kintone.proxy.upload",

  // レコードIDを取得する
  "kintone.app.record.getId",
  "kintone.mobile.app.record.getId",

  // レコードの値を取得する
  "kintone.app.record.get",
  "kintone.mobile.app.record.get",

  // レコードに値をセットする
  "kintone.app.record.set",
  "kintone.mobile.app.record.set",

  // アプリのIDを取得する
  "kintone.app.getId",
  "kintone.mobile.app.getId",

  // アプリのアイコンのURLを取得する
  "kintone.app.getIcons",
  "kintone.app.getIcons",

  // ルックアップフィールドの参照先のアプリIDを取得する
  "kintone.app.getLookupTargetAppId",
  "kintone.mobile.app.getLookupTargetAppId",

  // 関連レコード一覧の参照先のアプリIDを取得する
  "kintone.app.getRelatedRecordsTargetAppId",
  "kintone.mobile.app.getRelatedRecordsTargetAppId",

  // レコード一覧のクエリ文字列を取得する
  "kintone.app.getQueryCondition",
  "kintone.mobile.app.getQueryCondition",

  // レコード一覧のクエリ文字列を取得する（オプション付き）
  "kintone.app.getQuery",
  "kintone.mobile.app.getQuery",

  // ログインユーザーの情報を取得する
  "kintone.getLoginUser",
  "kintone.getLoginUser",

  // デザインのバージョンを取得する
  "kintone.getUiVersion",
  "kintone.getUiVersion",

  // フィールドの表示／非表示を切り替える
  "kintone.app.record.setFieldShown",
  "kintone.mobile.app.record.setFieldShown",

  // グループフィールドを開閉する
  "kintone.app.record.setGroupFieldOpen",
  "kintone.mobile.app.record.setGroupFieldOpen",

  // フィールド要素を取得する
  "kintone.app.record.getFieldElement",
  "kintone.mobile.app.record.getFieldElement",

  // メニューの上側の要素を取得する
  "kintone.app.record.getHeaderMenuSpaceElement",
  undefined,

  // ヘッダーの下側の要素を取得する
  undefined,
  "kintone.mobile.app.getHeaderSpaceElement",

  // スペースフィールドの要素を取得する
  "kintone.app.record.getSpaceElement",
  "kintone.mobile.app.record.getSpaceElement",

  // フィールド要素を取得する
  "kintone.app.getFieldElements",
  "kintone.mobile.app.getFieldElements",

  // メニューの右側の要素を取得する
  "kintone.app.getHeaderMenuSpaceElement",
  undefined,

  // メニューの下側の要素を取得する
  "kintone.app.getHeaderSpaceElement",
  undefined,

  // ヘッダーの下側の要素を取得する
  undefined,
  "kintone.mobile.app.getHeaderSpaceElement",

  // ポータルの上側の要素を取得する
  "kintone.portal.getContentSpaceElement",
  "kintone.mobile.portal.getContentSpaceElement",

  // スペースのトップ画面の上側の要素を取得する
  "kintone.space.portal.getContentSpaceElement",
  "kintone.mobile.space.portal.getContentSpaceElement",

  // 設定情報を取得する
  "kintone.plugin.app.getConfig",
  "kintone.plugin.app.getConfig",

  // 設定情報を保存する
  "kintone.plugin.app.setConfig",
  undefined,

  // 外部APIの実行に必要な情報を取得する
  "kintone.plugin.app.getProxyConfig",
  undefined,

  // 外部APIの実行に必要な情報を保存する
  "kintone.plugin.app.setProxyConfig",
  undefined,

  // 外部APIを実行する
  "kintone.plugin.app.proxy",
  "kintone.plugin.app.proxy",

  // 外部にファイルをアップロードする
  "kintone.plugin.app.proxy.upload",
  "kintone.plugin.app.proxy.upload",
];
