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
    return expect(() => exportRecords(apiClient, "1")).rejects.not.toThrow();
  });
});
