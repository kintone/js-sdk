export type Record = {
  // https://cybozu.dev/ja/kintone/docs/js-api/record/get-record-id/
  getId(): number;
  // https://cybozu.dev/ja/kintone/docs/js-api/record/get-record/
  get(): object;
  // https://cybozu.dev/ja/kintone/docs/js-api/record/set-record-value/
  set(record: object): void;
  // https://cybozu.dev/ja/kintone/docs/js-api/record/get-record-field-element/
  getFieldElement(fieldCode: string): Element;
  // https://cybozu.dev/ja/kintone/docs/js-api/record/get-space-element/
  getSpaceElement(id: string): Element;
  // https://cybozu.dev/ja/kintone/docs/js-api/record/open-field-group/
  setGroupFieldOpen(fieldCode: string, isOpen: boolean): void;
  // https://cybozu.dev/ja/kintone/docs/js-api/record/show-or-hide-a-field/
  setFieldShown(fieldCode: string, isShown: boolean): void;
  // https://cybozu.dev/ja/kintone/docs/js-api/record/get-record-header-menu-element/
  getHeaderMenuSpaceElement(): Element;
};

export type RecordMobile = {
  // https://cybozu.dev/ja/kintone/docs/js-api/record/get-record-id/
  getId: Record["getId"];
  // https://cybozu.dev/ja/kintone/docs/js-api/record/get-record/
  get: Record["get"];
  // https://cybozu.dev/ja/kintone/docs/js-api/record/set-record-value/
  set: Record["set"];
  // https://cybozu.dev/ja/kintone/docs/js-api/record/get-record-field-element/
  getFieldElement: Record["getFieldElement"];
  // https://cybozu.dev/ja/kintone/docs/js-api/record/get-space-element/
  getSpaceElement: Record["getSpaceElement"];
  // https://cybozu.dev/ja/kintone/docs/js-api/record/open-field-group/
  setGroupFieldOpen: Record["setGroupFieldOpen"];
  // https://cybozu.dev/ja/kintone/docs/js-api/record/show-or-hide-a-field/
  setFieldShown: Record["setFieldShown"];
};
