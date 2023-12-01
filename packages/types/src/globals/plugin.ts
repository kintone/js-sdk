export type Plugin = {
  app: {
    // https://cybozu.dev/ja/kintone/docs/js-api/plugins/get-config/
    getConfig(pluginId: string): PluginConfig;
    // https://cybozu.dev/ja/kintone/docs/js-api/plugins/set-config/
    setConfig(config: PluginConfig, successCallback?: () => void): void;
    // https://cybozu.dev/ja/kintone/docs/js-api/plugins/get-config-for-proxy/
    getProxyConfig(
      url: string,
      method: "GET" | "POST" | "PUT" | "DELETE",
    ): { headers: object; data: object };
    // https://cybozu.dev/ja/kintone/docs/js-api/plugins/set-config-for-proxy/
    setProxyConfig(
      url: string,
      method: "GET" | "POST" | "PUT" | "DELETE",
      headers: object,
      data: object,
      successCallback?: () => void,
    ): void;

    proxy: {
      // https://cybozu.dev/ja/kintone/docs/js-api/plugins/kintone-plug-in-proxy/
      (
        pluginId: string,
        url: string,
        method: "GET" | "POST" | "PUT" | "DELETE",
        headers: object,
        data: object | string,
      ): Promise<[string, number, object]>;
      (
        pluginId: string,
        url: string,
        method: "GET" | "POST" | "PUT" | "DELETE",
        headers: object,
        data: object | string,
        successCallback: (
          responseBody: string,
          statusCode: number,
          responseHeaders: object,
        ) => void,
        failureCallback: (responseBody: string) => void,
      ): void;
      // https://cybozu.dev/ja/kintone/docs/js-api/plugins/kintone-plug-in-proxy-upload/
      upload(
        pluginId: string,
        url: string,
        method: "POST" | "PUT",
        headers: object,
        data: { format: "RAW"; value: Blob } | string,
      ): Promise<string>;
      upload(
        pluginId: string,
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
  };
};

type PluginConfig = { [key: string]: string };
