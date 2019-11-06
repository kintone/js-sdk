import { KintoneAPIClient } from "../src/index";

const APP_ID = 8;
const RECORD_ID = 3;

export class Record {
  private client: KintoneAPIClient;
  constructor(client: KintoneAPIClient) {
    this.client = client;
  }
  public async getRecord() {
    try {
      console.log(await this.client.record.getRecord(APP_ID, RECORD_ID));
    } catch (error) {
      console.log(error);
    }
  }
  public async deleteRecord() {
    const ids = [21];
    const revisions = ["1"];
    console.log(await this.client.record.deleteRecords(APP_ID, ids, revisions));
  }
  public async addRecord() {
    // const code = "field code"

    // const record = {
    //   [code]: {
    //     value: "field value"
    //   }
    // };
    console.log(await this.client.record.addRecord(APP_ID /* , record*/));
  }
  public async updateRecord() {
    const params = {
      id: 22,
      record: {
        Customer: {
          value: "example"
        }
      }
    };
    console.log(await this.client.record.updateRecord(APP_ID, params));
  }
}
