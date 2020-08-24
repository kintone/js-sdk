import KintoneApiClient, {
  Option as ApiClientOption,
  UpdateAppCustomizeParameter,
} from "../../KintoneApiClient";

type MethodParameter = "GET" | "POST" | "PUT" | "DELETE";

const ApiPath = {
  File: "/k/v1/file.json",
  Customize: "/k/v1/app/customize.json",
} as const;

const ApiPreviewPath = {
  Customize: "/k/v1/preview/app/customize.json",
  Deploy: "/k/v1/preview/app/deploy.json",
} as const;

type ApiPathValues = typeof ApiPath[keyof typeof ApiPath];
type ApiPreviewPathValues = typeof ApiPreviewPath[keyof typeof ApiPreviewPath];

type PathParameter = ApiPathValues | ApiPreviewPathValues;

export default class MockKintoneApiClient extends KintoneApiClient {
  public logs: Array<{
    method: MethodParameter;
    path: PathParameter;
    body?: Record<string, unknown>;
    contentType?: string;
  }>;
  public willBeReturnResponse: any;
  constructor(
    ...args: [string, string, string, string, string, ApiClientOption]
  ) {
    super(...args);
    this.logs = [];
    this.willBeReturnResponse = {};
    const appDeployResp = {
      apps: [{ status: "SUCCESS" }],
    };
    this.willBeReturn(ApiPreviewPath.Deploy, "GET", appDeployResp)
      .willBeReturn(ApiPreviewPath.Deploy, "POST", appDeployResp)
      .willBeReturn(ApiPreviewPath.Customize, "PUT", {});
  }

  public willBeReturn(
    path: PathParameter,
    method: MethodParameter,
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
  public async getAppCustomize(appId: string) {
    return this.getByPathResponse({
      path: ApiPath.Customize,
      method: "GET",
      body: {
        app: appId,
      },
    });
  }

  public async deploySetting(appId: string) {
    return this.getByPathResponse({
      path: ApiPreviewPath.Deploy,
      method: "POST",
      body: { apps: [{ app: appId }] },
    });
  }

  public async downloadFile(fileKey: string) {
    return this.getByPathResponse({
      path: ApiPath.File,
      method: "GET",
      body: { fileKey },
    });
  }

  public async waitFinishingDeploy(appId: string, callback: () => void) {
    callback();
    return this.getByPathResponse({
      path: ApiPreviewPath.Deploy,
      method: "GET",
      body: { apps: [appId] },
    });
  }

  public async uploadFile(filePath: string) {
    return this.getByPathResponse({
      path: ApiPath.File,
      method: "POST",
    });
  }

  public async updateCustomizeSetting(params: UpdateAppCustomizeParameter) {
    return this.getByPathResponse({
      path: ApiPreviewPath.Customize,
      method: "PUT",
      body: params,
    });
  }

  private getByPathResponse(params: {
    path: PathParameter;
    method: MethodParameter;
    body?: Record<string, unknown>;
  }) {
    this.logs.push(params);
    const method = params.method;
    if (method === "POST" && params.path === ApiPath.File) {
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
