// イベントオブジェクトの型定義
export type JSAPIEventTypes = {
  // レコード一覧画面
  // レコード一覧画面を表示した後のイベント
  "app.record.index.show": {
    type: "app.record.index.show";
    appId: number;
    viewId: number;
    viewName: string;
    records: any;
  } & (
    | { viewType: "list"; date: null; offset: number; size: number }
    | { viewType: "calendar"; date: string; offset: null; size: null }
    | { viewType: "custom"; date: null; offset: number; size: number }
  );
  // レコード一覧画面のインライン編集を開始したときのイベント
  "app.record.index.edit.show": {
    type: "app.record.index.edit.show";
    appId: number;
    recordId: number;
    record: any;
  };
  // レコード一覧画面のインライン編集で保存するときのイベント
  "app.record.index.edit.submit": {
    type: "app.record.index.edit.submit";
    appId: number;
    recordId: number;
    record: any;
  };
  // レコード一覧画面のインライン編集に成功したときのイベント
  "app.record.index.edit.submit.success": {
    type: "app.record.index.edit.submit.success";
    appId: number;
    recordId: number;
    record: any;
  };
  // レコード一覧画面でレコードを削除する前のイベント
  "app.record.index.delete.submit": {
    type: "app.record.index.delete.submit";
    appId: number;
    recordId: number;
    record: any;
  };

  // レコード詳細画面
  // レコード詳細画面を表示した後のイベント
  "app.record.detail.show": {
    type: "app.record.detail.show";
    appId: number;
    recordId: number;
    record: any;
  };
  // レコード詳細画面でレコードを削除する前のイベント
  "app.record.detail.delete.submit": {
    type: "app.record.detail.delete.submit";
    appId: number;
    recordId: number;
    record: any;
  };
  // プロセス管理でアクションを実行するときのイベント
  "app.record.detail.process.proceed": {
    type: "app.record.detail.process.proceed";
    record: any;
    action: any;
    nextStatus: any;
    status: any;
  };

  // レコード追加画面
  // レコード追加画面を表示した後のイベント
  "app.record.create.show": {
    type: "app.record.create.show";
    appId: number;
    record: any;
    reuse: boolean;
  };
  // レコード追加画面で保存するときのイベント
  "app.record.create.submit": {
    type: "app.record.create.submit";
    appId: number;
    record: any;
  };
  // レコード追加画面で保存に成功した後のイベント
  "app.record.create.submit.success": {
    type: "app.record.create.submit.success";
    appId: number;
    recordId: number;
    record: any;
  };

  // レコード編集画面
  // レコード編集画面を表示した後のイベント
  "app.record.edit.show": {
    type: "app.record.edit.show";
    appId: number;
    record: any;
    recordId: any;
  };
  // レコード編集画面で保存するときのイベント
  "app.record.edit.submit": {
    type: "app.record.edit.submit";
    appId: number;
    recordId: number;
    record: any;
  };
  // レコード編集画面で保存に成功した後のイベント
  "app.record.edit.submit.success": {
    type: "app.record.edit.submit.success";
    appId: number;
    recordId: number;
    record: any;
  };
};
