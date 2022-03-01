import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { promises as fs } from "fs";

import os from "os";
import path from "path";
import { downloadRecords } from "../download";
import { DataLoaderFields } from "../../types/data-loader";

import * as caseCanGetRecords from "./fixtures/can_get_records";
import * as caseCanDownloadFiles from "./fixtures/can_download_files";
import * as caseCanDownloadFilesInSubtable from "./fixtures/can_download_files_in_subtable";

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
      downloadRecords({ apiClient, app: "1", attachmentsDir: "" })
    ).resolves.not.toThrow();
  });

  it("should pass parameters to the apiClient correctly", async () => {
    const getAllRecordsMockFn = jest.fn().mockResolvedValue([{}]);
    apiClient.record.getAllRecords = getAllRecordsMockFn;
    const APP_ID = "1";
    const CONDITION = 'Customer like "foo"';
    const ORDER_BY = "Customer desc";

    await downloadRecords({
      apiClient,
      app: APP_ID,
      attachmentsDir: "",
      condition: CONDITION,
      orderBy: ORDER_BY,
    });

    expect(getAllRecordsMockFn.mock.calls[0][0]).toStrictEqual({
      app: APP_ID,
      condition: CONDITION,
      orderBy: ORDER_BY,
    });
  });

  it("can get records", async () => {
    const records = caseCanGetRecords.input;
    const expectedRecords = caseCanGetRecords.expected;

    apiClient.record.getAllRecords = jest.fn().mockResolvedValue(records);
    const actual = await downloadRecords({
      apiClient,
      app: "1",
      attachmentsDir: "",
    });
    expect(actual).toStrictEqual(expectedRecords);
  });

  it("can download files to a specified directory", async () => {
    const kintoneRecords = caseCanDownloadFiles.input;
    const expectedRecords = caseCanDownloadFiles.expected;

    const testFileData = "test data";
    const tempDir = await fs.mkdtemp(
      path.join(os.tmpdir(), "kintone-data-loader-")
    );
    apiClient.record.getAllRecords = jest
      .fn()
      .mockResolvedValue(kintoneRecords);
    apiClient.file.downloadFile = jest.fn().mockResolvedValue(testFileData);
    const actual = await downloadRecords({
      apiClient,
      app: "1",
      attachmentsDir: tempDir,
    });
    expect(actual).toStrictEqual(expectedRecords);

    const attachmentValue = (
      expectedRecords[0].attachment as DataLoaderFields.File
    ).value;
    for (const attachment of attachmentValue) {
      const downloadFile = await fs.readFile(
        path.join(tempDir, attachment.localFilePath!)
      );
      expect(downloadFile.toString()).toBe(testFileData);
    }
  });

  it("can download files in subtable to a specified directory", async () => {
    const kintoneRecords = caseCanDownloadFilesInSubtable.input;
    const expectedRecords = caseCanDownloadFilesInSubtable.expected;

    const testFileData = "test data";
    const tempDir = await fs.mkdtemp(
      path.join(os.tmpdir(), "kintone-data-loader-")
    );
    apiClient.record.getAllRecords = jest
      .fn()
      .mockResolvedValue(kintoneRecords);
    apiClient.file.downloadFile = jest.fn().mockResolvedValue(testFileData);
    const actual = await downloadRecords({
      apiClient,
      app: "1",
      attachmentsDir: tempDir,
    });
    expect(actual).toStrictEqual(expectedRecords);

    const attachmentValue = (
      (expectedRecords[0].subTable as DataLoaderFields.Subtable).value[0].value
        .subTableFile as DataLoaderFields.File
    ).value;
    for (const attachment of attachmentValue) {
      const downloadFile = await fs.readFile(
        path.join(tempDir, attachment.localFilePath!)
      );
      expect(downloadFile.toString()).toBe(testFileData);
    }
  });
  it("should throw error when API response is error", () => {
    const error = new Error("error for test");
    apiClient.record.getAllRecords = jest.fn().mockRejectedValueOnce(error);
    return expect(
      downloadRecords({ apiClient, app: "1", attachmentsDir: "" })
    ).rejects.toThrow(error);
  });
});
