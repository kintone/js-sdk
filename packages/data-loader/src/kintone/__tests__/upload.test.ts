import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { uploadRecords } from "../upload";

import path from "path";

import * as canUploadFiles from "./fixtures/can_upload_files";
import * as canUploadFilesInSubtable from "./fixtures/can_upload_files_in_subtable";
import * as canUpdateRecordsWithUniqueField from "./fixtures/can_update_records_with_unique_field";

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

  it("should throw error when attachmentsDir is NOT given", () => {
    const getFormFieldsMockFn = jest
      .fn()
      .mockResolvedValue({ properties: canUploadFiles.properties });
    apiClient.app.getFormFields = getFormFieldsMockFn;

    const APP_ID = "1";
    const INPUT_RECORDS = canUploadFiles.input;

    return expect(
      uploadRecords({
        apiClient,
        attachmentsDir: "",
        app: APP_ID,
        records: INPUT_RECORDS,
      })
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
    const addRecordsMockFn = jest.fn().mockResolvedValue([{}]);
    apiClient.record.addRecords = addRecordsMockFn;

    const ATTACHMENTS_DIR = "AttachmentsFolder";
    const APP_ID = "1";
    const INPUT_RECORDS = canUploadFiles.input;
    const EXPECTED_RECORDS = canUploadFiles.expected;

    await uploadRecords({
      apiClient,
      attachmentsDir: ATTACHMENTS_DIR,
      app: APP_ID,
      records: INPUT_RECORDS,
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
    expect(addRecordsMockFn.mock.calls[0][0]).toStrictEqual({
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
    const addRecordsMockFn = jest.fn().mockResolvedValue([{}]);
    apiClient.record.addRecords = addRecordsMockFn;

    const ATTACHMENTS_DIR = "AttachmentsFolder";
    const APP_ID = "1";
    const INPUT_RECORDS = canUploadFilesInSubtable.input;
    const EXPECTED_RECORDS = canUploadFilesInSubtable.expected;

    await uploadRecords({
      apiClient,
      attachmentsDir: ATTACHMENTS_DIR,
      app: APP_ID,
      records: INPUT_RECORDS,
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
    expect(addRecordsMockFn.mock.calls[0][0]).toStrictEqual({
      app: APP_ID,
      records: EXPECTED_RECORDS,
    });
  });

  it("should throw error when API response is error", () => {
    const error = new Error("error for test");
    apiClient.app.getFormFields = jest.fn().mockRejectedValueOnce(error);
    return expect(
      uploadRecords({ apiClient, attachmentsDir: "", app: "1", records: [{}] })
    ).rejects.toThrow(error);
  });

  it("should update records correctly with single line text", async () => {
    apiClient.app.getFormFields = jest.fn().mockResolvedValue({
      properties: canUpdateRecordsWithUniqueField.properties,
    });
    const updateRecordsMockFn = jest.fn().mockResolvedValue({
      records: [
        {
          id: "1",
          revision: "2",
        },
        {
          id: "2",
          revision: "2",
        },
      ],
    });
    apiClient.record.updateRecords = updateRecordsMockFn;
    const addRecordsMockFn = jest.fn().mockResolvedValue({});
    apiClient.record.addRecords = addRecordsMockFn;

    const APP_ID = "1";
    await uploadRecords({
      apiClient,
      app: APP_ID,
      records: canUpdateRecordsWithUniqueField.input,
      updateKey: "singleLineText",
    });

    expect(updateRecordsMockFn).toBeCalledWith(
      canUpdateRecordsWithUniqueField
        .expectedParamsOfUpdateRecordsBySingleLineText[0]
    );
    expect(addRecordsMockFn).not.toHaveBeenCalled();
  });

  it("should update records correctly with number", async () => {
    apiClient.app.getFormFields = jest.fn().mockResolvedValue({
      properties: canUpdateRecordsWithUniqueField.properties,
    });
    const updateRecordsMockFn = jest.fn().mockResolvedValue({
      records: [
        {
          id: "1",
          revision: "2",
        },
        {
          id: "2",
          revision: "2",
        },
      ],
    });
    apiClient.record.updateRecords = updateRecordsMockFn;
    const addRecordsMockFn = jest.fn().mockResolvedValue({});
    apiClient.record.addRecords = addRecordsMockFn;

    const APP_ID = "1";
    await uploadRecords({
      apiClient,
      app: APP_ID,
      records: canUpdateRecordsWithUniqueField.input,
      updateKey: "number",
    });

    expect(updateRecordsMockFn).toBeCalledWith(
      canUpdateRecordsWithUniqueField.expectedParamsOfUpdateRecordsByNumber[0]
    );
    expect(addRecordsMockFn).not.toHaveBeenCalled();
  });

  it("should throw error when update key field is not unique", async () => {
    apiClient.app.getFormFields = jest.fn().mockResolvedValue({
      properties: canUpdateRecordsWithUniqueField.properties,
    });

    const APP_ID = "1";
    expect(
      uploadRecords({
        apiClient,
        app: APP_ID,
        records: canUpdateRecordsWithUniqueField.input,
        updateKey: "singleLineText_nonUnique",
      })
    ).rejects.toThrow("update key field should set to unique");
  });

  it("should throw error when unsupported field is passed as update key", async () => {
    apiClient.app.getFormFields = jest.fn().mockResolvedValue({
      properties: canUpdateRecordsWithUniqueField.properties,
    });

    const APP_ID = "1";
    expect(
      uploadRecords({
        apiClient,
        app: APP_ID,
        records: canUpdateRecordsWithUniqueField.input,
        updateKey: "date",
      })
    ).rejects.toThrow("unsupported field type for update key");
  });

  it("should throw error when unexisted field is passed as update key", async () => {
    apiClient.app.getFormFields = jest.fn().mockResolvedValue({
      properties: canUpdateRecordsWithUniqueField.properties,
    });

    const APP_ID = "1";
    expect(
      uploadRecords({
        apiClient,
        app: APP_ID,
        records: canUpdateRecordsWithUniqueField.input,
        updateKey: "unexistedField",
      })
    ).rejects.toThrow("no such update key");
  });
});
