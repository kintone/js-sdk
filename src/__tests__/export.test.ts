import { exportRecords } from "../commands/export";
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
    apiClient.record.getRecords = jest
      .fn()
      .mockResolvedValue({ records: [{}] });
    return expect(
      exportRecords(apiClient, { app: "1", attachmentDir: "" })
    ).resolves.not.toThrow();
  });
});
