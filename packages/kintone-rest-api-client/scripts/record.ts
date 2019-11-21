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
      console.log(
        await this.client.record.getRecord({ app: APP_ID, id: RECORD_ID })
      );
    } catch (error) {
      console.log(error);
    }
  }
  public async getRecordWithError() {
    try {
      console.log(
        await this.client.record.getRecord({ app: 99999, id: RECORD_ID })
      );
    } catch (error) {
      console.log(error);
    }
  }
  public async deleteRecord() {
    const ids = [21];
    const revisions = ["1"];
    console.log(
      await this.client.record.deleteRecords({ app: APP_ID, ids, revisions })
    );
  }
  public async addRecord() {
    // const code = "field code"

    // const record = {
    //   [code]: {
    //     value: "field value"
    //   }
    // };
    console.log(
      await this.client.record.addRecord({ app: APP_ID /* , record*/ })
    );
  }
  public async updateRecord() {
    const params = {
      app: APP_ID,
      id: 22,
      record: {
        Customer: {
          value: "example"
        }
      }
    };
    console.log(await this.client.record.updateRecord(params));
  }

  public async getRecords() {
    console.log(
      await this.client.record.getRecords({
        app: APP_ID,
        fields: [],
        totalCount: true
      })
    );
  }

  public async addRecords() {
    console.log(
      await this.client.record.addRecords({
        app: APP_ID,
        records: [{}, {}, {}]
      })
    );
  }

  public async updateRecords() {
    const params = {
      app: APP_ID,
      records: [
        {
          id: 8,
          record: {
            Customer: {
              value: "example"
            }
          }
        },
        {
          updateKey: {
            field: "Code",
            value: "Case1"
          },
          record: {
            Customer: {
              value: "example2"
            }
          }
        }
      ]
    };

    console.log(await this.client.record.updateRecords(params));
  }

  public async createCursor() {
    console.log(
      await this.client.record.createCursor({
        app: APP_ID,
        fields: ["Customer", "Person"],
        size: 10
      })
    );
  }

  public async getRecordsByCursor() {
    const cursorId = "<shuld set a cursor id>";
    console.log(await this.client.record.getRecordsByCursor({ id: cursorId }));
  }

  public async deleteCursor() {
    const cursorId = "<shuld set a cursor id>";
    console.log(await this.client.record.deleteCursor({ id: cursorId }));
  }
}
