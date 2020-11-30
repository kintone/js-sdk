import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { isUrlString, wait } from "./util";

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
    oauthToken: string | null,
    basicAuthUsername: string | null,
    basicAuthPassword: string | null,
    domain: string,
    public options: Option
  ) {
    const kintoneUrl =
      domain.indexOf("https://") > -1 ? domain : `https://${domain}`;
    let auth;
    if (username && password) {
      auth = {
        username,
        password,
      };
    }
    if (oauthToken) {
      auth = {
        oAuthToken: oauthToken,
      };
    }
    let basicAuth;
    if (basicAuthUsername && basicAuthPassword) {
      basicAuth = {
        username: basicAuthUsername,
        password: basicAuthPassword,
      };
    }
    this.restApiClient = new KintoneRestAPIClient({
      baseUrl: kintoneUrl,
      auth,
      basicAuth,
      featureFlags: {
        enableAbortSearchError: false,
      },
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
