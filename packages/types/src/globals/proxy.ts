export type Proxy = {
  // https://cybozu.dev/ja/kintone/docs/js-api/proxy/kintone-proxy/
  (
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    headers: object,
    data: object | string,
  ): Promise<any>;
  (
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    headers: object,
    data: object | string,
    successCallback: (
      resp: string,
      statusCode: number,
      responseHeaders: object,
    ) => void,
    failureCallback: (responseBody: string) => void,
  ): void;
  // https://cybozu.dev/ja/kintone/docs/js-api/proxy/kintone-proxy-upload/
  upload(
    url: string,
    method: "POST" | "PUT",
    headers: object,
    data: { format: "RAW"; value: Blob } | string,
  ): Promise<string>;
  upload(
    url: string,
    method: "POST" | "PUT",
    headers: object,
    data: { format: "RAW"; value: Blob } | string,
    successCallback: (
      responseBody: string,
      statusCode: number,
      responseHeaders: object,
    ) => void,
    failureCallback: (responseBody: string) => void,
  ): void;
};
