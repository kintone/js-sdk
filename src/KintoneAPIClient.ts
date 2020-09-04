import { KintoneRestAPIClient, AppID } from "@kintone/rest-api-client";
import { AppID } from "@kintone/rest-api-client/lib/client/types";

export interface Option {
  proxy: string;
  guestSpaceId: number;
}

export class KintoneAPIClient {
  private restApiClient: KintoneRestAPIClient;
  public constructor(params: {
    username: string;
    password: string;
    basicAuthUsername: string | null;
    basicAuthPassword: string | null;
    baseUrl: string;
    options: Option;
  }) {
    const {
      username,
      password,
      basicAuthUsername,
      basicAuthPassword,
      baseUrl,
      options,
    } = params;
    let basicAuth;
    if (basicAuthUsername && basicAuthPassword) {
      basicAuth = {
        username: basicAuthUsername,
        password: basicAuthPassword,
      };
    }
    this.restApiClient = new KintoneRestAPIClient({
      baseUrl,
      auth: { username, password },
      basicAuth,
      featureFlags: {
        enableAbortSearchError: false,
      },
    });
  }

  public getRecords(params: { app: AppID }) {
    return this.restApiClient.record.getRecords(params);
  }

  public downloadFile(fileKey: string) {
    return this.restApiClient.file.downloadFile({
      fileKey,
    });
  }
}
