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
    it("should not be failed", async () => {
      apiClient.record.addAllRecords = jest.fn().mockResolvedValue([{}]);
      const printer = jest.fn();
      await importRecords(apiClient, printer, {
        app: "1",
        attachmentDir: "",
        filePath: path.resolve(__dirname, "./fixtures/test.json"),
      });
      expect(printer).toHaveBeenCalledWith("SUCCESS: records[0 - 0]");
    });
    it("should throw error when API response is error", async () => {
      const error = new Error();
      apiClient.record.addAllRecords = jest.fn().mockRejectedValueOnce(error);
      const printer = jest.fn();
      try {
        await importRecords(apiClient, printer, {
          app: "1",
          attachmentDir: "",
          filePath: path.resolve(__dirname, "./fixtures/test.json"),
        });
      } catch (e) {
        expect(e).toBe(error);
      }
      expect(printer).toHaveBeenCalledWith("FAILED: records[0 - 0]");
      expect.assertions(2);
    });
    it("should throw error when API response is error when records[2000 - 2999] includes bad data", async () => {
      const error = new Error();
      apiClient.record.addAllRecords = jest
        .fn()
        .mockImplementationOnce((app, records) => Promise.resolve())
        .mockImplementationOnce((app, records) => Promise.reject(error));
      const printer = jest.fn();
      try {
        await importRecords(apiClient, printer, {
          app: "1",
          attachmentDir: "",
          filePath: path.resolve(__dirname, "./fixtures/test_3000.json"),
        });
      } catch (e) {
        expect(e).toBe(error);
      }
      expect(printer).toHaveBeenNthCalledWith(1, "SUCCESS: records[0 - 1999]");
      expect(printer).toHaveBeenNthCalledWith(
        2,
        "FAILED: records[2000 - 2999]"
      );
      expect.assertions(3);
    });
  });
  describe("csv", () => {
    it("should not be failed", async () => {
      apiClient.record.addAllRecords = jest.fn().mockResolvedValue([{}]);
      const printer = jest.fn();
      await importRecords(apiClient, printer, {
        app: "1",
        attachmentDir: "",
        filePath: path.resolve(__dirname, "./fixtures/test.csv"),
      });
      expect(printer).toHaveBeenCalledWith("SUCCESS: records[0 - 0]");
    });
  });
});
