import { buildImporter } from "../import";
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
    it("should not be failed", async () => {
      apiClient.record.addRecords = jest.fn().mockResolvedValue([{}]);
      const reporter = jest.fn();
      const importRecords = buildImporter({ apiClient, reporter });
      await importRecords({
        app: "1",
        attachmentDir: "",
        filePath: path.resolve(__dirname, "./fixtures/test.json"),
      });
      expect(reporter).toHaveBeenCalledWith("SUCCESS: records[0 - 0]");
    });
    it("should throw error when API response is error", async () => {
      const error = new Error();
      apiClient.record.addRecords = jest.fn().mockRejectedValueOnce(error);
      const reporter = jest.fn();
      try {
        const importRecords = buildImporter({ apiClient, reporter });
        await importRecords({
          app: "1",
          attachmentDir: "",
          filePath: path.resolve(__dirname, "./fixtures/test.json"),
        });
      } catch (e) {
        expect(e).toBe(error);
      }
      expect(reporter).toHaveBeenCalledWith("FAILED: records[0 - 0]");
      expect.assertions(2);
    });
    it("should throw error when API response is error when records[100 - 2999] includes bad data", async () => {
      const error = new Error();
      apiClient.record.addRecords = jest
        .fn()
        .mockImplementationOnce((app, records) => Promise.resolve())
        .mockImplementationOnce((app, records) => Promise.reject(error));
      const reporter = jest.fn();
      try {
        const importRecords = buildImporter({ apiClient, reporter });
        await importRecords({
          app: "1",
          attachmentDir: "",
          filePath: path.resolve(__dirname, "./fixtures/test_3000.json"),
        });
      } catch (e) {
        expect(e).toBe(error);
      }
      expect(reporter).toHaveBeenNthCalledWith(1, "SUCCESS: records[0 - 99]");
      expect(reporter).toHaveBeenNthCalledWith(
        2,
        "FAILED: records[100 - 2999]"
      );
      expect.assertions(3);
    });
  });
  describe("csv", () => {
    it("should not be failed", async () => {
      apiClient.record.addRecords = jest.fn().mockResolvedValue([{}]);
      const reporter = jest.fn();
      const importRecords = buildImporter({ apiClient, reporter });
      await importRecords({
        app: "1",
        attachmentDir: "",
        filePath: path.resolve(__dirname, "./fixtures/test.csv"),
      });
      expect(reporter).toHaveBeenCalledWith("SUCCESS: records[0 - 0]");
    });
  });
});
