import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { uploadRecords } from "../upload";

describe("import", () => {
  let apiClient: KintoneRestAPIClient;
  beforeEach(() => {
    apiClient = new KintoneRestAPIClient({
      baseUrl: "https://localhost/",
      auth: { apiToken: "dummy" },
    });
  });
  it("should not fail", () => {
    apiClient.app.getFormFields = jest
      .fn()
      .mockResolvedValue({ properties: {} });
    apiClient.record.addRecords = jest.fn().mockResolvedValue([{}]);
    return expect(
      uploadRecords({ apiClient, attachmentsDir: "", app: "1", records: [] })
    ).resolves.not.toThrow();
  });

  it("should pass parameters to the apiClient correctly", async () => {
    const getFormFieldsMockFn = jest.fn().mockResolvedValue({ properties: {} });
    apiClient.app.getFormFields = getFormFieldsMockFn;
    const addRecordsMockFn = jest.fn().mockResolvedValue([{}]);
    apiClient.record.addRecords = addRecordsMockFn;
    const ATTACHMENTS_DIR = "";
    const APP_ID = "1";
    const RECORDS = [{}];

    await uploadRecords({
      apiClient,
      attachmentsDir: ATTACHMENTS_DIR,
      app: APP_ID,
      records: RECORDS,
    });

    expect(getFormFieldsMockFn.mock.calls[0][0]).toStrictEqual({
      app: APP_ID,
    });
    expect(addRecordsMockFn.mock.calls[0][0]).toStrictEqual({
      app: APP_ID,
      records: RECORDS,
    });
  });

  it("should throw error when API response is error", () => {
    const error = new Error("error for test");
    apiClient.app.getFormFields = jest.fn().mockRejectedValueOnce(error);
    return expect(
      uploadRecords({ apiClient, attachmentsDir: "", app: "1", records: [{}] })
    ).rejects.toThrow(error);
  });
});
