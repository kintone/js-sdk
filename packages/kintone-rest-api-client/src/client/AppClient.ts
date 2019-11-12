import { HttpClient } from "../http";

type AppID = string | number;
type Lang = "ja" | "en" | "zh" | "user" | "default";

type Properties = {
  [fieldCode: string]: any;
};

export class AppClient {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  public async getFormFields<T extends Properties>(
    app: AppID,
    lang?: Lang,
    preview?: boolean
  ): Promise<{ properties: T; revision: string }> {
    const path = `/k/v1${preview ? "/preview" : ""}/app/form/fields.json`;
    return this.client.get(path, { app, lang });
  }

  public async addFormFields(
    app: AppID,
    properties: object,
    revision?: number
  ): Promise<{ revision: string }> {
    const path = "/k/v1/preview/app/form/fields.json";
    return this.client.post(path, { app, properties, revision });
  }

  public async updateFormFields(
    app: AppID,
    properties: object,
    revision?: number
  ): Promise<{ revision: string }> {
    const path = "/k/v1/preview/app/form/fields.json";
    return this.client.put(path, { app, properties, revision });
  }
}
