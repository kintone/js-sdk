export type Space = {
  // https://cybozu.dev/ja/kintone/docs/js-api/space/get-content-space-element/
  getContentSpaceElement(): Element;
};

export type MobileSpace = {
  // https://cybozu.dev/ja/kintone/docs/js-api/space/get-content-space-element/
  getContentSpaceElement: Space["getContentSpaceElement"];
};
