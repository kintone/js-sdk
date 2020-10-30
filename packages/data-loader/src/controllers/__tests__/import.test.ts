import { importRecords } from "../import";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import path from "path";

describe("import", () => {
  let apiClient: KintoneRestAPIClient;
  beforeEach(() => {
    apiClient = new KintoneRestAPIClient({
      baseUrl: "https://localhost/",
      auth: { apiToken: "dummy" },
    });
  });
  describe("json", () => {
    it("should not be failed", () => {
      apiClient.record.addAllRecords = jest.fn().mockResolvedValue([{}]);
      return expect(
        importRecords(apiClient, {
          app: "1",
          attachmentDir: "",
          filePath: path.resolve(__dirname, "./fixtures/test.json"),
        })
      ).resolves.not.toThrow();
    });
  });
  describe("csv", () => {
    it("should not be failed", () => {
      apiClient.record.addAllRecords = jest.fn().mockResolvedValue([{}]);
      return expect(
        importRecords(apiClient, {
          app: "1",
          attachmentDir: "",
          filePath: path.resolve(__dirname, "./fixtures/test.csv"),
        })
      ).resolves.not.toThrow();
    });
  });
});
