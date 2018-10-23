import KintoneApiClient, {
  Option as ApiClientOption,
  RequestParams
} from "../src/KintoneApiClient";

export default class MockKintoneApiClient extends KintoneApiClient {
  public logs: RequestParams[];
  constructor(
    ...args: [string, string, string, string, string, ApiClientOption]
  ) {
    super(...args);
    this.logs = [];
  }
  public async sendRequest(params: RequestParams) {
    this.logs.push(params);
    switch (params.path) {
      case "/k/v1/file.json":
        return { fileKey: `key--${params.path}` };
      case "/k/v1/preview/app/deploy.json":
        return { apps: [{ status: "SUCCESS" }] };
    }
  }
}
