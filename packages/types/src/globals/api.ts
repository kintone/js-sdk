export type Api = {
  // https://cybozu.dev/ja/kintone/docs/js-api/api/kintone-rest-api-request/
  (
    pathOrUrl: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    params: any,
  ): Promise<any>;
  (
    pathOrUrl: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    params: any,
    successCallback: (resp: any) => void,
    failureCallback: (err: any) => void,
  ): void;
  // https://cybozu.dev/ja/kintone/docs/js-api/api/get-url/
  url(path: string, isGuestSpace?: boolean): string;
  // https://cybozu.dev/ja/kintone/docs/js-api/api/get-url-including-query/
  urlForGet(path: string, params?: object, isGuestSpace?: boolean): string;
  // https://cybozu.dev/ja/kintone/docs/js-api/api/get-concurrency-limit/
  getConcurrencyLimit(): Promise<{
    limit: number;
    running: number;
  }>;
};
