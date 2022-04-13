import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { addRecords } from "../../add";

import path from "path";

import * as canUploadFiles from "./fixtures/can_upload_files";
import * as canUploadFilesInSubtable from "./fixtures/can_upload_files_in_subtable";

describe("addRecords", () => {
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
    apiClient.record.addAllRecords = jest.fn().mockResolvedValue([{}]);
    return expect(
      addRecords(apiClient, "1", [], { attachmentsDir: "" })
    ).resolves.not.toThrow();
  });

  it("should pass parameters to the apiClient correctly", async () => {
    const getFormFieldsMockFn = jest.fn().mockResolvedValue({ properties: {} });
    apiClient.app.getFormFields = getFormFieldsMockFn;
    const addAllRecordsMockFn = jest.fn().mockResolvedValue([{}]);
    apiClient.record.addAllRecords = addAllRecordsMockFn;
    const ATTACHMENTS_DIR = "";
    const APP_ID = "1";
    const RECORDS = [{}];

    await addRecords(apiClient, APP_ID, RECORDS, {
      attachmentsDir: ATTACHMENTS_DIR,
    });

    expect(getFormFieldsMockFn.mock.calls[0][0]).toStrictEqual({
      app: APP_ID,
    });
    expect(addAllRecordsMockFn.mock.calls[0][0]).toStrictEqual({
      app: APP_ID,
      records: RECORDS,
    });
  });

  it("should throw error when attachmentsDir is NOT given", () => {
    const getFormFieldsMockFn = jest
      .fn()
      .mockResolvedValue({ properties: canUploadFiles.properties });
    apiClient.app.getFormFields = getFormFieldsMockFn;

    const APP_ID = "1";
    const INPUT_RECORDS = canUploadFiles.input;

    return expect(
      addRecords(apiClient, APP_ID, INPUT_RECORDS, { attachmentsDir: "" })
    ).rejects.toThrow(new Error("--attachments-dir option is required."));
  });

  it("should upload files correctly when attachmentsDir is given", async () => {
    const getFormFieldsMockFn = jest
      .fn()
      .mockResolvedValue({ properties: canUploadFiles.properties });
    apiClient.app.getFormFields = getFormFieldsMockFn;
    const uploadFileMockFn = jest
      .fn()
      .mockReturnValueOnce({ fileKey: "abcde" })
      .mockReturnValueOnce({ fileKey: "fghij" });
    apiClient.file.uploadFile = uploadFileMockFn;
    const addAllRecordsMockFn = jest.fn().mockResolvedValue([{}]);
    apiClient.record.addAllRecords = addAllRecordsMockFn;

    const ATTACHMENTS_DIR = "AttachmentsFolder";
    const APP_ID = "1";
    const INPUT_RECORDS = canUploadFiles.input;
    const EXPECTED_RECORDS = canUploadFiles.expected;

    await addRecords(apiClient, APP_ID, INPUT_RECORDS, {
      attachmentsDir: ATTACHMENTS_DIR,
    });

    // apiClient.file.uploadFile should be called with correct filePath
    const fileInfos = canUploadFiles.input[0].attachment.value as Array<{
      localFilePath: string;
    }>;
    expect(uploadFileMockFn.mock.calls[0][0]).toStrictEqual({
      file: {
        path: path.join(ATTACHMENTS_DIR, fileInfos[0].localFilePath),
      },
    });
    expect(uploadFileMockFn.mock.calls[1][0]).toStrictEqual({
      file: {
        path: path.join(ATTACHMENTS_DIR, fileInfos[1].localFilePath),
      },
    });

    // records should contain fileKeys
    expect(addAllRecordsMockFn.mock.calls[0][0]).toStrictEqual({
      app: APP_ID,
      records: EXPECTED_RECORDS,
    });
  });

  it("should upload files correctly when attachmentsDir is given and with subtable", async () => {
    const getFormFieldsMockFn = jest
      .fn()
      .mockResolvedValue({ properties: canUploadFilesInSubtable.properties });
    apiClient.app.getFormFields = getFormFieldsMockFn;
    const uploadFileMockFn = jest
      .fn()
      .mockReturnValueOnce({ fileKey: "abcde" })
      .mockReturnValueOnce({ fileKey: "fghij" });
    apiClient.file.uploadFile = uploadFileMockFn;
    const addAllRecordsMockFn = jest.fn().mockResolvedValue([{}]);
    apiClient.record.addAllRecords = addAllRecordsMockFn;

    const ATTACHMENTS_DIR = "AttachmentsFolder";
    const APP_ID = "1";
    const INPUT_RECORDS = canUploadFilesInSubtable.input;
    const EXPECTED_RECORDS = canUploadFilesInSubtable.expected;

    await addRecords(apiClient, APP_ID, INPUT_RECORDS, {
      attachmentsDir: ATTACHMENTS_DIR,
    });

    // apiClient.file.uploadFile should be called with correct filePath
    const fileInfos = canUploadFiles.input[0].attachment.value as Array<{
      localFilePath: string;
    }>;
    expect(uploadFileMockFn.mock.calls[0][0]).toStrictEqual({
      file: {
        path: path.join(ATTACHMENTS_DIR, fileInfos[0].localFilePath),
      },
    });
    expect(uploadFileMockFn.mock.calls[1][0]).toStrictEqual({
      file: {
        path: path.join(ATTACHMENTS_DIR, fileInfos[1].localFilePath),
      },
    });

    // records should contain fileKeys
    expect(addAllRecordsMockFn.mock.calls[0][0]).toStrictEqual({
      app: APP_ID,
      records: EXPECTED_RECORDS,
    });
  });

  it("should throw error when API response is error", () => {
    const error = new Error("error for test");
    apiClient.app.getFormFields = jest.fn().mockRejectedValueOnce(error);
    return expect(
      addRecords(apiClient, "1", [{}], { attachmentsDir: "" })
    ).rejects.toThrow(error);
  });
});
