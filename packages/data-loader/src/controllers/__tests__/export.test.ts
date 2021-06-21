import { exportRecords } from "../export";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { promises as fs } from "fs";

import os from "os";
import path from "path";

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
      exportRecords(apiClient, { app: "1", attachmentDir: "" })
    ).resolves.not.toThrow();
  });

  it("should pass parameters to the apiClient correctly", async () => {
    const getAllRecordsMockFn = jest.fn().mockResolvedValue([{}]);
    apiClient.record.getAllRecords = getAllRecordsMockFn;
    const APP_ID = 1;
    const CONDITION = 'Customer like "foo"';
    const ORDER_BY = "Customer desc";

    await exportRecords(apiClient, {
      app: APP_ID,
      attachmentDir: "",
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
        fieldCode: {
          type: "SINGLE_LINE_TEXT",
          value: "value1",
        },
      },
      {
        fieldCode: {
          type: "SINGLE_LINE_TEXT",
          value: "value1",
        },
      },
    ];
    apiClient.record.getAllRecords = jest.fn().mockResolvedValue(records);
    const actual = await exportRecords(apiClient, {
      app: "1",
      attachmentDir: "",
    });
    expect(actual).toStrictEqual(records);
  });
  it("can download files to a specified directory", async () => {
    const recordWithAttachment = {
      $id: {
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
            contentType: "text/plain",
            fileKey: "test-file-key",
            name: "test.txt",
          },
        ],
      },
    };
    const testFileData = "test data";

    const records = [
      recordWithAttachment,
      {
        $id: {
          value: "3",
        },
        fieldCode: {
          type: "SINGLE_LINE_TEXT",
          value: "value1",
        },
      },
    ];

    const attachmentMetadataList = [
      {
        attachment: ["test.txt"],
      },
      {},
    ];

    const tempDir = await fs.mkdtemp(
      path.join(os.tmpdir(), "kintone-data-loader-")
    );

    apiClient.record.getAllRecords = jest.fn().mockResolvedValue(records);
    apiClient.file.downloadFile = jest.fn().mockResolvedValue(testFileData);
    const actual = await exportRecords(apiClient, {
      app: "1",
      attachmentDir: tempDir,
    });
    expect(actual).toStrictEqual(records);
    const attachmentsJson = await fs.readFile(
      path.join(tempDir, "attachments.json")
    );
    expect(JSON.parse(attachmentsJson.toString())).toStrictEqual(
      attachmentMetadataList
    );
    const downloadedFile = await fs.readFile(
      path.join(
        tempDir,
        recordWithAttachment.$id.value,
        recordWithAttachment.attachment.value[0].name
      )
    );
    expect(downloadedFile.toString()).toBe(testFileData);
  });
  it("can download files of subtable to a specified directory", async () => {
    const recordWithAttachment = {
      $id: {
        value: "2",
      },
      fieldCode: {
        type: "SINGLE_LINE_TEXT",
        value: "value1",
      },
      subtable: {
        type: "SUBTABLE",
        value: [
          {
            id: "4",
            value: {
              singleLineText: {
                type: "SINGLE_LINE_TEXT",
                value: "value1",
              },
              attachmentInSubtable: {
                type: "FILE",
                value: [
                  {
                    contentType: "text/plain",
                    fileKey: "test-file-key",
                    name: "test.txt",
                  },
                ],
              },
            },
          },
        ],
      },
    };
    const testFileData = "test data";

    const records = [
      recordWithAttachment,
      {
        $id: {
          value: "3",
        },
        fieldCode: {
          type: "SINGLE_LINE_TEXT",
          value: "value1",
        },
      },
    ];

    const attachmentMetadataList = [
      {
        subtable: [{ attachmentInSubtable: ["test.txt"] }],
      },
      {},
    ];

    const tempDir = await fs.mkdtemp(
      path.join(os.tmpdir(), "kintone-data-loader-")
    );

    apiClient.record.getAllRecords = jest.fn().mockResolvedValue(records);
    apiClient.file.downloadFile = jest.fn().mockResolvedValue(testFileData);
    const actual = await exportRecords(apiClient, {
      app: "1",
      attachmentDir: tempDir,
    });
    expect(actual).toStrictEqual(records);
    const attachmentsJson = await fs.readFile(
      path.join(tempDir, "attachments.json")
    );
    expect(JSON.parse(attachmentsJson.toString())).toStrictEqual(
      attachmentMetadataList
    );
    const downloadedFile = await fs.readFile(
      path.join(
        tempDir,
        recordWithAttachment.$id.value,
        recordWithAttachment.subtable.value[0].value.attachmentInSubtable
          .value[0].name
      )
    );
    expect(downloadedFile.toString()).toBe(testFileData);
  });
  it("can download files with duplicate file names to a specified directory", async () => {
    const recordWithAttachment = {
      $id: {
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
            contentType: "text/plain",
            fileKey: "test-file-key",
            name: "test.txt",
          },
          {
            contentType: "text/plain",
            fileKey: "test-file-key",
            name: "test.txt",
          },
        ],
      },
      attachment2: {
        type: "FILE",
        value: [
          {
            contentType: "text/plain",
            fileKey: "test-file-key",
            name: "test.txt",
          },
          {
            contentType: "text/plain",
            fileKey: "test-file-key",
            name: "test.txt",
          },
        ],
      },
      subtable: {
        type: "SUBTABLE",
        value: [
          {
            id: "4",
            value: {
              singleLineText: {
                type: "SINGLE_LINE_TEXT",
                value: "value1",
              },
              attachmentInSubtable: {
                type: "FILE",
                value: [
                  {
                    contentType: "text/plain",
                    fileKey: "test-file-key",
                    name: "test.txt",
                  },
                  {
                    contentType: "text/plain",
                    fileKey: "test-file-key",
                    name: "test.txt",
                  },
                ],
              },
              attachmentInSubtable2: {
                type: "FILE",
                value: [
                  {
                    contentType: "text/plain",
                    fileKey: "test-file-key",
                    name: "test.txt",
                  },
                  {
                    contentType: "text/plain",
                    fileKey: "test-file-key",
                    name: "test.txt",
                  },
                ],
              },
            },
          },
        ],
      },
    };
    const testFileData = "test data";

    const records = [
      recordWithAttachment,
      {
        $id: {
          value: "3",
        },
        fieldCode: {
          type: "SINGLE_LINE_TEXT",
          value: "value1",
        },
      },
    ];

    const attachmentMetadataList = [
      {
        attachment: ["test.txt", "test-1.txt"],
        attachment2: ["test-2.txt", "test-3.txt"],
        subtable: [
          {
            attachmentInSubtable: ["test-4.txt", "test-5.txt"],
            attachmentInSubtable2: ["test-6.txt", "test-7.txt"],
          },
        ],
      },
      {},
    ];

    const tempDir = await fs.mkdtemp(
      path.join(os.tmpdir(), "kintone-data-loader-")
    );

    apiClient.record.getAllRecords = jest.fn().mockResolvedValue(records);
    apiClient.file.downloadFile = jest.fn().mockResolvedValue(testFileData);
    const actual = await exportRecords(apiClient, {
      app: "1",
      attachmentDir: tempDir,
    });
    expect(actual).toStrictEqual(records);
    const attachmentsJson = await fs.readFile(
      path.join(tempDir, "attachments.json")
    );
    expect(JSON.parse(attachmentsJson.toString())).toStrictEqual(
      attachmentMetadataList
    );
  });
  it("should throw error when API response is error", () => {
    const error = new Error("error for test");
    apiClient.record.getAllRecords = jest.fn().mockRejectedValueOnce(error);
    return expect(
      exportRecords(apiClient, { app: "1", attachmentDir: "" })
    ).rejects.toThrow(error);
  });
});
