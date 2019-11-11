import { KintoneAPIClient } from "../src/index";

const APP_ID = 8;

export class App {
  private client: KintoneAPIClient;
  constructor(client: KintoneAPIClient) {
    this.client = client;
  }
  public async getFormFields() {
    try {
      console.log(await this.client.app.getFormFields(APP_ID));
    } catch (error) {
      console.log(error);
    }
  }

  public async getFormFieldsPreview() {
    try {
      console.log(await this.client.app.getFormFields(APP_ID, "default", true));
    } catch (error) {
      console.log(error);
    }
  }
}
