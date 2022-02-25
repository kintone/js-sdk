import { run } from "../import";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import path from "path";
import { RestAPIClientOptions } from "../../api";

describe("import", () => {
  let apiClient: KintoneRestAPIClient;
  const restApiClientOptions: RestAPIClientOptions = {
    baseUrl: "https://localhost/k/",
  };
  beforeEach(() => {
    apiClient = new KintoneRestAPIClient({
      baseUrl: "https://localhost/",
      auth: { apiToken: "dummy" },
    });
  });
  describe("json", () => {
    it("should not be failed", async () => {
      apiClient.record.addRecords = jest.fn().mockResolvedValue([{}]);
      console.log = jest.fn();
      const spyConsoleLog = jest.spyOn(console, "log").mockImplementation();
      await run({
        app: "1",
        filePath: path.resolve(__dirname, "./fixtures/test.json"),
        ...restApiClientOptions,
      });
      expect(spyConsoleLog).toHaveBeenCalledWith("SUCCESS: records[0 - 0]");
    });
    // it("should throw error when API response is error", async () => {
    //   const error = new Error();
    //   apiClient.record.addRecords = jest.fn().mockRejectedValueOnce(error);
    //   const reporter = jest.fn();
    //   try {
    //     const importRecords = buildImporter({ apiClient, reporter });
    //     await importRecords({
    //       app: "1",
    //       filePath: path.resolve(__dirname, "./fixtures/test.json"),
    //     });
    //   } catch (e) {
    //     expect(e).toBe(error);
    //   }
    //   expect(reporter).toHaveBeenCalledWith("FAILED: records[0 - 0]");
    //   expect.assertions(2);
    // });
    // it("should throw error when API response is error when records[100 - 2999] includes bad data", async () => {
    //   const error = new Error();
    //   apiClient.record.addRecords = jest
    //     .fn()
    //     .mockImplementationOnce((app, records) => Promise.resolve())
    //     .mockImplementationOnce((app, records) => Promise.reject(error));
    //   const reporter = jest.fn();
    //   try {
    //     const importRecords = buildImporter({ apiClient, reporter });
    //     await importRecords({
    //       app: "1",
    //       filePath: path.resolve(__dirname, "./fixtures/test_3000.json"),
    //     });
    //   } catch (e) {
    //     expect(e).toBe(error);
    //   }
    //   expect(reporter).toHaveBeenNthCalledWith(1, "SUCCESS: records[0 - 99]");
    //   expect(reporter).toHaveBeenNthCalledWith(
    //     2,
    //     "FAILED: records[100 - 2999]"
    //   );
    //   expect.assertions(3);
    // });
  });
  // describe("csv", () => {
  //   it("should not be failed", async () => {
  //     apiClient.record.addRecords = jest.fn().mockResolvedValue([]);
  //     apiClient.app.getFormFields = jest.fn().mockReturnValue({
  //       properties: {
  //         recordId: {
  //           type: "RECORD_NUMBER",
  //         },
  //         text: {
  //           type: "SINGLE_LINE_TEXT",
  //         },
  //       },
  //     });
  //     const reporter = jest.fn();
  //     const importRecords = buildImporter({ apiClient, reporter });
  //     await importRecords({
  //       app: "1",
  //       filePath: path.resolve(__dirname, "./fixtures/test.csv"),
  //     });
  //     expect(reporter).toHaveBeenCalledWith("SUCCESS: records[0 - 0]");
  //   });
  // });
});
