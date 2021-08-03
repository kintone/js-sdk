import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { isUrlString, parseProxy, wait } from "./util";

export interface Option {
  proxy: string;
  guestSpaceId: number;
}

export type UpdateAppCustomizeParameter = {
  app: string | number;
  scope?: "ALL" | "ADMIN" | "NONE" | undefined;
  desktop?: { [key: string]: unknown };
  mobile?: { [key: string]: unknown };
  revision?: string | number;
};

export default class KintoneApiClient {
  private restApiClient: KintoneRestAPIClient;
  public constructor(
    username: string | null,
    password: string | null,
    oAuthToken: string | null,
    basicAuthUsername: string | null,
    basicAuthPassword: string | null,
    baseUrl: string,
    public options: Option
  ) {
    let auth;
    if (username && password) {
      auth = {
        username,
        password,
      };
    }
    if (oAuthToken) {
      auth = {
        oAuthToken,
      };
    }
    let basicAuth;
    if (basicAuthUsername && basicAuthPassword) {
      basicAuth = {
        username: basicAuthUsername,
        password: basicAuthPassword,
      };
    }
    let guestSpaceId;
    if (options.guestSpaceId) {
      guestSpaceId = options.guestSpaceId;
    }
    let proxy;
    if (options.proxy) {
      proxy = parseProxy(options.proxy);
    }
    this.restApiClient = new KintoneRestAPIClient({
      baseUrl,
      auth,
      basicAuth,
      featureFlags: {
        enableAbortSearchError: false,
      },
      guestSpaceId,
      proxy,
    });
  }

  public uploadFile(filePath: string) {
    return this.restApiClient.file.uploadFile({
      file: {
        path: filePath,
      },
    });
  }

  public async prepareCustomizeFile(fileOrUrl: string): Promise<any> {
    const isUrl = isUrlString(fileOrUrl);
    if (isUrl) {
      return {
        type: "URL",
        url: fileOrUrl,
      };
    }
    const { fileKey } = await this.uploadFile(fileOrUrl);
    return {
      type: "FILE",
      file: {
        fileKey,
      },
    };
  }

  public updateCustomizeSetting(params: UpdateAppCustomizeParameter) {
    return this.restApiClient.app.updateAppCustomize(params);
  }

  public deploySetting(appId: string) {
    return this.restApiClient.app.deployApp({
      apps: [{ app: appId }],
    });
  }

  public async waitFinishingDeploy(appId: string, callback: () => void) {
    let deployed = false;
    while (!deployed) {
      const resp = await this.restApiClient.app.getDeployStatus({
        apps: [appId],
      });
      const successedApps = resp.apps;
      const successedAppsLength = successedApps.filter((r) => {
        return r.status === "SUCCESS";
      }).length;
      deployed = successedAppsLength === resp.apps.length;
      if (!deployed) {
        await wait(1000);
        callback();
      }
    }
    deployed = true;
  }

  public downloadFile(fileKey: string) {
    return this.restApiClient.file.downloadFile({
      fileKey,
    });
  }

  public getAppCustomize(appId: string) {
    return this.restApiClient.app.getAppCustomize({
      app: appId,
    });
  }

  private getBase64EncodedCredentials(
    username: string,
    password: string
  ): string {
    const buffer = Buffer.from(username + ":" + password);
    return buffer.toString("base64");
  }

  private getBasicAuthorization(
    basicAuthUsername: string,
    basicAuthPassword: string
  ): string {
    return `Basic ${this.getBase64EncodedCredentials(
      basicAuthUsername,
      basicAuthPassword
    )}`;
  }
}

export class AuthenticationError extends Error {}
