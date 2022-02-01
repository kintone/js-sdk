import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { promises as fs } from "fs";

import os from "os";
import path from "path";
import { downloadRecords } from "../download";

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
      downloadRecords(apiClient, { app: "1", attachmentsDir: "" })
    ).resolves.not.toThrow();
  });

  it("should pass parameters to the apiClient correctly", async () => {
    const getAllRecordsMockFn = jest.fn().mockResolvedValue([{}]);
    apiClient.record.getAllRecords = getAllRecordsMockFn;
    const APP_ID = "1";
    const CONDITION = 'Customer like "foo"';
    const ORDER_BY = "Customer desc";

    await downloadRecords(apiClient, {
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
    const records = [
      {
        $id: {
          value: "1",
        },
        fieldCode: {
          type: "SINGLE_LINE_TEXT",
          value: "value1",
        },
      },
      {
        $id: {
          value: "2",
        },
        fieldCode: {
          type: "SINGLE_LINE_TEXT",
          value: "value1",
        },
      },
    ];
    apiClient.record.getAllRecords = jest.fn().mockResolvedValue(records);
    const actual = await downloadRecords(apiClient, {
      app: "1",
      attachmentsDir: "",
    });
    expect(actual).toStrictEqual(records);
  });

  it("can download files to a specified directory", async () => {
    const fileInfo = {
      contentType: "text/plain",
      fileKey: "test-file-key",
      name: "test.txt",
      size: "123456",
    };
    const kintoneRecords = [
      {
        $id: {
          type: "__ID__",
          value: "2",
        },
        fieldCode: {
          type: "SINGLE_LINE_TEXT",
          value: "value1",
        },
        attachment: {
          type: "FILE",
          value: [fileInfo, fileInfo],
        },
      },
      {
        $id: {
          type: "__ID__",
          value: "3",
        },
        fieldCode: {
          type: "SINGLE_LINE_TEXT",
          value: "value1",
        },
      },
    ];

    const expectedRecords = [
      {
        $id: {
          type: "__ID__",
          value: "2",
        },
        fieldCode: {
          type: "SINGLE_LINE_TEXT",
          value: "value1",
        },
        attachment: {
          type: "FILE",
          value: [
            {
              ...fileInfo,
              localFilePath: path.join("attachment-2", "test.txt"),
            },
            {
              ...fileInfo,
              localFilePath: path.join("attachment-2", "test (1).txt"),
            },
          ],
        },
      },
      {
        $id: {
          type: "__ID__",
          value: "3",
        },
        fieldCode: {
          type: "SINGLE_LINE_TEXT",
          value: "value1",
        },
      },
    ];

    const testFileData = "test data";
    const tempDir = await fs.mkdtemp(
      path.join(os.tmpdir(), "kintone-data-loader-")
    );
    apiClient.record.getAllRecords = jest
      .fn()
      .mockResolvedValue(kintoneRecords);
    apiClient.file.downloadFile = jest.fn().mockResolvedValue(testFileData);
    const actual = await downloadRecords(apiClient, {
      app: "1",
      attachmentsDir: tempDir,
    });
    expect(actual).toStrictEqual(expectedRecords);

    const attachmentValue = expectedRecords[0].attachment!.value;
    for (const attachment of attachmentValue) {
      const downloadFile = await fs.readFile(
        path.join(tempDir, attachment.localFilePath)
      );
      expect(downloadFile.toString()).toBe(testFileData);
    }
  });
  it("should throw error when API response is error", () => {
    const error = new Error("error for test");
    apiClient.record.getAllRecords = jest.fn().mockRejectedValueOnce(error);
    return expect(
      downloadRecords(apiClient, { app: "1", attachmentsDir: "" })
    ).rejects.toThrow(error);
  });
});
