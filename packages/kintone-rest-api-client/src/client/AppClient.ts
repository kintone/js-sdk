import { HttpClient } from "../http";

type AppID = string | number;
type Lang = "ja" | "en" | "zh" | "user" | "default";

export class AppClient {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  public async getFormFields(app: AppID, lang?: Lang, preview?: boolean) {
    const path = `/k/v1${preview ? "/preview" : ""}/app/form/fields.json`;
    return this.client.get(path, { app, lang });
  }
}
