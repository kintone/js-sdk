import fs from "fs";
import request = require("request-promise");
import { getBoundMessage } from "./messages";
import { Option } from "./util";

interface RequestOption {
  method: string;
  url: string;
  headers: {
    [propName: string]: any;
  };
  body: object | string | null;
  formData?: {};
  proxy?: string;
  tunnel?: boolean;
  [propName: string]: any;
}

/* tslint:disable max-classes-per-file */

export default class KintoneRequest {
  public requestOptions: RequestOption;
  constructor(
    public auth: string,
    public kintoneUrl: string,
    public path: string,
    public method: string,
    public body: object | string | null,
    public options: Option
  ) {
    this.requestOptions = {
      method: this.method,
      url: this.kintoneUrl + this.path,
      headers: {
        "X-Cybozu-Authorization": this.auth,
        "Content-Type": "application/json"
      },
      body: this.body
    };
    if (this.options.guestSpaceId) {
      this.requestOptions.url =
        this.kintoneUrl +
        `/k/guest/${this.options.guestSpaceId}` +
        this.path.slice(2);
    }
    if (this.options.proxy) {
      this.requestOptions.proxy = this.options.proxy;
      this.requestOptions.tunnnel = true;
    }
  }
  get reqOptions() {
    return this.requestOptions;
  }
  set proxy(value: string) {
    this.requestOptions.proxy = value;
  }
  set tunnnel(value: boolean) {
    this.requestOptions.tunnel = value;
  }
  set contentType(value: string) {
    this.requestOptions.headers["Content-Type"] = value;
  }
  set contentLength(value: number) {
    this.requestOptions.headers["Content-Length"] = value;
  }
  set formData(value: object) {
    this.requestOptions.formData = value;
  }
  set qs(value: object) {
    this.requestOptions.qs = JSON.stringify(value);
  }
  public async send(): Promise<any> {
    return await request(this.requestOptions).then(resp => JSON.parse(resp));
  }
}

export class UploadFile extends KintoneRequest {
  constructor(
    public auth: string,
    public kintoneUrl: string,
    public filePath: string,
    public contentType: string,
    public options: Option
  ) {
    super(auth, kintoneUrl, "/k/v1/file.json", "POST", null, options);
    this.contentType = "multipart/form-data";
    this.formData = {
      file: {
        value: fs.createReadStream(filePath, "utf8"),
        options: { contentType }
      }
    };
  }
}

export class UpdateCustomizeSetting extends KintoneRequest {
  constructor(
    public auth: string,
    public kintoneUrl: string,
    public body: object,
    public options: Option
  ) {
    super(
      auth,
      kintoneUrl,
      "/k/v1/preview/app/customize.json",
      "PUT",
      JSON.stringify(body),
      options
    );
  }
}

export class DeploySetting extends KintoneRequest {
  constructor(
    public auth: string,
    public kintoneUrl: string,
    public appId: number | string,
    public options: Option
  ) {
    super(
      auth,
      kintoneUrl,
      "/k/v1/preview/app/deploy.json",
      "POST",
      JSON.stringify({ apps: [{ app: appId }] }),
      options
    );
  }
}

export class DeployStatus extends KintoneRequest {
  constructor(
    public auth: string,
    public kintoneUrl: string,
    public appId: number | string,
    public options: Option
  ) {
    super(
      auth,
      kintoneUrl,
      "/k/v1/preview/app/deploy.json",
      "GET",
      JSON.stringify({ apps: [appId] }),
      options
    );
  }
  public async check(): Promise<void> {
    const m = getBoundMessage(this.options.lang);
    let deployed = false;
    while (!deployed) {
      await new Promise(r => setTimeout(r, 1000));
      await this.send().then(resp => {
        const successedApps: [any] = resp.apps;
        const successedAppsLength = successedApps.filter(r => {
          return r.status === "SUCCESS";
        }).length;
        deployed = successedAppsLength === resp.apps.length;
      });
      console.log(m("M_Deploying"));
    }
    deployed = true;
  }
}
