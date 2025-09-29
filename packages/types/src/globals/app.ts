import type { Record, RecordMobile } from "./record.js";

export type App = {
  record: Record;
  // https://cybozu.dev/ja/kintone/docs/js-api/app/get-app-id/
  getId(): number;
  // https://cybozu.dev/ja/kintone/docs/js-api/app/get-app-icon-urls/
  getIcons(apps: number[]): string;
  // https://cybozu.dev/ja/kintone/docs/js-api/app/get-record-list-field-elements/
  getFieldElements(fieldCode: string): Element[];
  // https://cybozu.dev/ja/kintone/docs/js-api/app/get-record-list-header-menu-element/
  getHeaderMenuSpaceElement(): Element;
  // https://cybozu.dev/ja/kintone/docs/js-api/app/get-record-list-header-element/
  getHeaderSpaceElement(): Element;
  // https://cybozu.dev/ja/kintone/docs/js-api/app/get-lookup-target/
  getLookupTargetAppId(fieldCode: string): number;
  // https://cybozu.dev/ja/kintone/docs/js-api/app/get-related-records-target/
  getRelatedRecordsTargetAppId(fieldCode: string): number;
  // https://cybozu.dev/ja/kintone/docs/js-api/app/get-record-list-query/
  getQueryCondition(): string;
  // https://cybozu.dev/ja/kintone/docs/js-api/app/get-record-list-query-with-order-by-limit-offset/
  getQuery(): string;
};

export type MobileApp = {
  record: RecordMobile;
  // https://cybozu.dev/ja/kintone/docs/js-api/app/get-app-id/
  getId: App["getId"];
  // https://cybozu.dev/ja/kintone/docs/js-api/app/get-record-list-field-elements/
  getFieldElements: App["getFieldElements"];
  // https://cybozu.dev/ja/kintone/docs/js-api/app/get-mobile-header-element/
  getHeaderSpaceElement(): Element;
  // https://cybozu.dev/ja/kintone/docs/js-api/app/get-lookup-target/
  getLookupTargetAppId: App["getLookupTargetAppId"];
  // https://cybozu.dev/ja/kintone/docs/js-api/app/get-related-records-target/
  getRelatedRecordsTargetAppId: App["getRelatedRecordsTargetAppId"];
  // https://cybozu.dev/ja/kintone/docs/js-api/app/get-record-list-query/
  getQueryCondition: App["getQueryCondition"];
  // https://cybozu.dev/ja/kintone/docs/js-api/app/get-record-list-query-with-order-by-limit-offset/
  getQuery: App["getQuery"];
};
