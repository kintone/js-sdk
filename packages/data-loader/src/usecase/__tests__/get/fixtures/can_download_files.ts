import { RecordForExport } from "../../../../types/data-loader";
import { KintoneRecordForResponse } from "../../../../types/kintone";
import path from "path";

const fileInfo = {
  contentType: "text/plain",
  fileKey: "test-file-key",
  name: "test.txt",
  size: "123456",
};

export const input: KintoneRecordForResponse[] = [
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
    attachment: {
      type: "FILE",
      value: [fileInfo],
    },
  },
];

export const expected: RecordForExport[] = [
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
    attachment: {
      type: "FILE",
      value: [
        {
          ...fileInfo,
          localFilePath: path.join("attachment-3", "test.txt"),
        },
      ],
    },
  },
];
