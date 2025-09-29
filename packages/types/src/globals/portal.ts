export type Portal = {
  // https://cybozu.dev/ja/kintone/docs/js-api/portal/get-content-portal-element/
  getContentSpaceElement(): Element;
};

export type MobilePortal = {
  // https://cybozu.dev/ja/kintone/docs/js-api/portal/get-content-portal-element/
  getContentSpaceElement(): Portal["getContentSpaceElement"];
};
