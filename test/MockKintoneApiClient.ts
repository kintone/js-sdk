import KintoneApiClient, {
  Option as ApiClientOption,
  RequestParams
} from "../src/KintoneApiClient";

export default class MockKintoneApiClient extends KintoneApiClient {
  public logs: RequestParams[];
  public willBeReturnResponse: any;
  constructor(
    ...args: [string, string, string, string, string, ApiClientOption]
  ) {
    super(...args);
    this.logs = [];
    this.willBeReturnResponse = {};
    const appDeployResp = {
      apps: [{ status: "SUCCESS" }]
    };
    this.willBeReturn("/k/v1/preview/app/deploy.json", "GET", appDeployResp)
      .willBeReturn("/k/v1/preview/app/deploy.json", "POST", appDeployResp)
      .willBeReturn("/k/v1/preview/app/customize.json", "PUT", {});
  }

  public willBeReturn(
    path: string,
    method: string,
    willBeReturn: string | object
  ) {
    let byPath: any = this.willBeReturnResponse[path];
    if (!byPath) {
      byPath = {};
    }
    byPath[method] = willBeReturn;
    this.willBeReturnResponse[path] = byPath;
    return this;
  }

  public async sendRequest(params: RequestParams) {
    this.logs.push(params);
    const method = params.method;
    if (method === "POST" && params.path === "/k/v1/file.json") {
      return { fileKey: `key--${params.path}` };
    }
    const byPath = this.willBeReturnResponse[params.path];
    if (!byPath || !byPath[params.method]) {
      console.info(
        `not mocked request: [${params.method}] ${params.path} returns {}`
      );
      return {};
    }
    return byPath[params.method];
  }
}
