import { exportRecords } from "../export";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";

describe("export", () => {
  let apiClient: KintoneRestAPIClient;
  beforeEach(() => {
    apiClient = new KintoneRestAPIClient({
      baseUrl: "https://localhost/",
      auth: { apiToken: "dummy" },
    });
  });
  it("should not be failed", () => {
    apiClient.record.getAllRecords = jest.fn().mockResolvedValue([{}]);
    return expect(
      exportRecords(apiClient, { app: "1", attachmentDir: "" })
    ).resolves.not.toThrow();
  });
  it("can get records", async () => {
    const records = [
      {
        fieldCode: {
          type: "SINGLE_LINE_TEXT",
          value: "value1",
        },
      },
      {
        fieldCode: {
          type: "SINGLE_LINE_TEXT",
          value: "value1",
        },
      },
    ];
    apiClient.record.getAllRecords = jest.fn().mockResolvedValue(records);
    const actual = await exportRecords(apiClient, {
      app: "1",
      attachmentDir: "",
    });
    expect(actual).toStrictEqual(records);
  });
  it.todo("can download files to a specified directory");
});
