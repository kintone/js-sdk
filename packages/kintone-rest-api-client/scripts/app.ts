import { KintoneAPIClient } from "../src/index";

const APP_ID = 8;

export class App {
  private client: KintoneAPIClient;
  constructor(client: KintoneAPIClient) {
    this.client = client;
  }
  public async getFormFields() {
    try {
      console.log(await this.client.app.getFormFields({ app: APP_ID }));
    } catch (error) {
      console.log(error);
    }
  }

  public async getFormFieldsPreview() {
    try {
      console.log(
        await this.client.app.getFormFields({ app: APP_ID, preview: true })
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async addFormFields() {
    const properties = {
      fieldCode: {
        type: "SINGLE_LINE_TEXT",
        code: "fieldCode",
        label: "Text Field"
      }
    };
    try {
      console.log(
        await this.client.app.addFormFields({ app: APP_ID, properties })
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async updateFormFields() {
    const properties = {
      fieldCode: {
        type: "SINGLE_LINE_TEXT",
        label: "Text Field 2"
      }
    };
    try {
      console.log(
        await this.client.app.updateFormFields({ app: APP_ID, properties })
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async deleteFormFields() {
    const fields = ["fieldCode"];

    try {
      console.log(
        await this.client.app.deleteFormFields({ app: APP_ID, fields })
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async getFormLayout() {
    try {
      console.log(await this.client.app.getFormLayout({ app: APP_ID }));
    } catch (error) {
      console.log(error);
    }
  }

  public async getFormLayoutPreview() {
    try {
      console.log(
        await this.client.app.getFormLayout({ app: APP_ID, preview: true })
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async updateFormLayout() {
    try {
      const { layout } = await this.client.app.getFormLayout({
        app: APP_ID,
        preview: true
      });
      const lastRow = layout.pop();
      if (lastRow) {
        const newLayout = [lastRow, ...layout];

        console.log(
          await this.client.app.updateFormLayout({
            app: APP_ID,
            layout: newLayout
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
}
