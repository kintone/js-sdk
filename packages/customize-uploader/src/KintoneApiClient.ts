import fs from "fs";
import request from "request-promise";
import { isUrlString, wait } from "./util";

interface RequestOption {
  method: string;
  url: string;
  headers: {
    [propName: string]: any;
  };
  body: object | string | null;
  formData?: object;
  proxy?: string;
  tunnel?: boolean;
}

export interface Option {
  proxy: string;
  guestSpaceId: number;
}

export interface RequestParams {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  body: object;
  contentType?: string;
}

export default class KintoneApiClient {
  private auth: string;
  private kintoneUrl: string;
  public constructor(
    username: string,
    password: string,
    domain: string,
    public options: Option
  ) {
    this.kintoneUrl =
      domain.indexOf("https://") > -1 ? domain : `https://${domain}`;
    this.auth = this.getXCybozuAuthorization(username, password);
  }

  public uploadFile(filePath: string, contentType: string) {
    return this.sendRequest({
      method: "POST",
      path: "/k/v1/file.json",
      body: {
        file: {
          value: fs.createReadStream(filePath, "utf8"),
          options: { contentType }
        }
      },
      contentType: "multipart/form-data"
    });
  }

  public async prepareCustomizeFile(
    fileOrUrl: string,
    contentType: string
  ): Promise<any> {
    const isUrl = isUrlString(fileOrUrl);
    if (isUrl) {
      return {
        type: "URL",
        url: fileOrUrl
      };
    } else {
      const { fileKey } = await this.uploadFile(fileOrUrl, contentType);
      return {
        type: "FILE",
        file: {
          fileKey
        }
      };
    }
  }

  public updateCustomizeSetting(setting: any) {
    return this.sendRequest({
      method: "PUT",
      path: "/k/v1/preview/app/customize.json",
      body: setting
    });
  }

  public deploySetting(appId: string) {
    return this.sendRequest({
      method: "POST",
      path: "/k/v1/preview/app/deploy.json",
      body: { apps: [{ app: appId }] }
    });
  }

  public async waitFinishingDeploy(appId: string, callback: () => void) {
    let deployed = false;
    while (!deployed) {
      const resp = await this.sendRequest({
        method: "GET",
        path: "/k/v1/preview/app/deploy.json",
        body: { apps: [appId] }
      });
      const successedApps: [any] = resp.apps;
      const successedAppsLength = successedApps.filter(r => {
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

  public async sendRequest(params: RequestParams) {
    const requestOptions = this.buildRequestOptions(params);
    try {
      const resp = await request(requestOptions);
      return JSON.parse(resp);
    } catch (e) {
      if (e.statusCode === 520) {
        const responseBody = JSON.parse(e.response.body);
        // We assume that CB_WA01 is an authentication error
        if (responseBody.code === "CB_WA01") {
          throw new AuthenticationError(responseBody.message);
        }
      }
      throw new Error("Unexpected Error:" + e.toString());
    }
  }

  private buildRequestOptions({
    method,
    path,
    body,
    contentType
  }: RequestParams): RequestOption {
    const isFormData = contentType && contentType === "multipart/form-data";
    const requestOptions: RequestOption = Object.assign(
      {
        method,
        url: this.options.guestSpaceId
          ? this.kintoneUrl +
            `/k/guest/${this.options.guestSpaceId}` +
            path.slice(2)
          : this.kintoneUrl + path,
        headers: {
          "X-Cybozu-Authorization": this.auth,
          "Content-Type": contentType || "application/json"
        }
      },
      isFormData
        ? { formData: body, body: null }
        : { body: JSON.stringify(body) }
    );
    if (this.options.proxy) {
      requestOptions.proxy = this.options.proxy;
      requestOptions.tunnel = true;
    }
    return requestOptions;
  }

  private getXCybozuAuthorization(username: string, password: string): string {
    const buffer = new Buffer(username + ":" + password);
    return buffer.toString("base64");
  }
}

/* tslint:disable max-classes-per-file */
export class AuthenticationError extends Error {}
