import type { KintoneRestAPIClient } from "@kintone/rest-api-client";

const APP_ID = 8;
const RECORD_ID = 3;

export class Record {
  private client: KintoneRestAPIClient;
  constructor(client: KintoneRestAPIClient) {
    this.client = client;
  }
  public async getRecord() {
    try {
      console.log(
        await this.client.record.getRecord({ app: APP_ID, id: RECORD_ID }),
      );
    } catch (error) {
      console.log(error);
    }
  }
  public async getRecordWithError() {
    try {
      console.log(
        await this.client.record.getRecord({ app: 99999, id: RECORD_ID }),
      );
    } catch (error) {
      console.log(error);
    }
  }
  public async deleteRecord() {
    const ids = [21];
    const revisions = ["1"];
    console.log(
      await this.client.record.deleteRecords({ app: APP_ID, ids, revisions }),
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
      await this.client.record.addRecord({ app: APP_ID /* , record*/ }),
    );
  }
  public async addRecordUsingMultipleApiTokens() {
    const params = {
      app: APP_ID,
      record: {
        Lookup: {
          value: "example",
        },
      },
    };
    console.log(await this.client.record.addRecord(params));
  }
  public async updateRecord() {
    const params = {
      app: APP_ID,
      id: 22,
      record: {
        Customer: {
          value: "example",
        },
      },
    };
    console.log(await this.client.record.updateRecord(params));
  }

  public async upsertRecord() {
    const params = {
      app: APP_ID,
      updateKey: {
        field: "Code",
        value: 300,
      },
      record: {
        Customer: {
          value: "upsertTest",
        },
      },
    };
    console.log(await this.client.record.upsertRecord(params));
  }

  public async getRecords() {
    console.log(
      await this.client.record.getRecords({
        app: APP_ID,
        fields: [],
        totalCount: true,
      }),
    );
  }

  public async addRecords() {
    console.log(
      await this.client.record.addRecords({
        app: APP_ID,
        records: [{}, {}, {}],
      }),
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
              value: "example",
            },
          },
        },
        {
          updateKey: {
            field: "Code",
            value: "Case1",
          },
          record: {
            Customer: {
              value: "example2",
            },
          },
        },
      ],
    };

    console.log(await this.client.record.updateRecords(params));
  }

  public async createCursor() {
    console.log(
      await this.client.record.createCursor({
        app: APP_ID,
        fields: ["Customer", "Person"],
        size: 10,
      }),
    );
  }

  public async getRecordsByCursor() {
    const cursorId = "<should set a cursor id>";
    console.log(await this.client.record.getRecordsByCursor({ id: cursorId }));
  }

  public async deleteCursor() {
    const cursorId = "<should set a cursor id>";
    console.log(await this.client.record.deleteCursor({ id: cursorId }));
  }

  public async getAllRecords() {
    console.log(
      await this.client.record.getAllRecords({
        app: APP_ID,
        fields: ["Customer"],
        condition: 'Customer != "foo"',
        orderBy: "Customer desc",
        withCursor: false,
      }),
    );
  }

  public async getAllRecordsWithId() {
    console.log(
      await this.client.record.getAllRecordsWithId({
        app: APP_ID,
        fields: [],
        condition: 'Customer != "foo"',
      }),
    );
  }

  public async getAllRecordsWithOffset() {
    console.log(
      await this.client.record.getAllRecordsWithOffset({
        app: APP_ID,
        fields: [],
        condition: 'Customer != "foo"',
      }),
    );
  }

  public async getAllRecordsWithCursor() {
    console.log(
      await this.client.record.getAllRecordsWithCursor({
        app: APP_ID,
        fields: ["Customer", "Person"],
      }),
    );
  }

  public async addAllRecords() {
    const records = Array.from({ length: 3000 }, (_, index) => index + 1).map(
      (value) => ({
        Customer: {
          value,
        },
      }),
    );
    console.dir(
      await this.client.record.addAllRecords({
        app: APP_ID,
        records,
      }),
      { depth: 5 },
    );
  }

  public async updateAllRecords() {
    const records = await this.client.record.getAllRecords({
      app: APP_ID,
      condition: 'Customer = "foo"',
    });
    const result = await this.client.record.updateAllRecords({
      app: APP_ID,
      records: records.map((record) => {
        if (record.$id.type === "__ID__") {
          return {
            id: record.$id.value,
            record: { Customer: { value: "bar" } },
          };
        }
        throw new Error();
      }),
    });
    console.log(result);
  }

  public async deleteAllRecords() {
    const records = await this.client.record.getAllRecords({ app: APP_ID });
    try {
      const result = await this.client.record.deleteAllRecords({
        app: APP_ID,
        records: records.map((record) => {
          if (
            record.$id.type === "__ID__" &&
            record.$revision.type === "__REVISION__"
          ) {
            return {
              id: record.$id.value,
              revision: record.$revision.value,
            };
          }
          throw new Error();
        }),
      });
      console.log(result);
    } catch (e) {
      console.dir(e, { depth: 5 });
    }
  }

  public async addRecordComment() {
    const params = {
      app: APP_ID,
      record: RECORD_ID,
      comment: {
        text: "Hello",
        mentions: [
          {
            code: "Administrator",
            type: "USER" as const,
          },
        ],
      },
    };
    console.log(await this.client.record.addRecordComment(params));
  }

  public async deleteRecordComment() {
    const params = {
      app: APP_ID,
      record: RECORD_ID,
      comment: 1,
    };
    console.log(await this.client.record.deleteRecordComment(params));
  }

  public async getRecordComments() {
    const params = {
      app: APP_ID,
      record: RECORD_ID,
      order: "desc" as const,
      offset: 5,
      limit: 5,
    };
    console.log(await this.client.record.getRecordComments(params));
  }

  public async updateRecordAssignees() {
    const params = {
      app: APP_ID,
      id: RECORD_ID,
      assignees: [],
    };
    console.log(await this.client.record.updateRecordAssignees(params));
  }

  public async updateRecordStatus() {
    const params = {
      action: "action1to2",
      app: APP_ID,
      id: RECORD_ID,
    };
    console.log(await this.client.record.updateRecordStatus(params));
  }

  public async updateRecordsStatus() {
    const params = {
      app: APP_ID,
      records: [{ id: RECORD_ID, action: "action1to2" }],
    };
    console.log(await this.client.record.updateRecordsStatus(params));
  }
}
