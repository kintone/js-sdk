import { KintoneRestAPIClient } from "../src";

const APP_ID = 8;
const RECORD_ID = 3;

export class BulkRequest {
  private client: KintoneRestAPIClient;
  constructor(client: KintoneRestAPIClient) {
    this.client = client;
  }

  public async run() {
    const params = {
      requests: [
        {
          method: "POST",
          api: "/k/v1/record.json",
          payload: {
            app: APP_ID,
            record: {
              Customer: {
                value: "example"
              }
            }
          }
        },
        {
          method: "PUT",
          api: "/k/v1/record.json",
          payload: {
            app: APP_ID,
            id: RECORD_ID,
            record: {
              Customer: {
                value: "example2"
              }
            }
          }
        },
        {
          method: "DELETE",
          api: "/k/v1/records.json",
          payload: {
            app: APP_ID,
            ids: [10, 11]
          }
        }
      ]
    };
    try {
      console.log(await this.client.bulkRequest(params));
    } catch (error) {
      console.log(error);
    }
  }
}
