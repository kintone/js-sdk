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
    subTable: {
      type: "SUBTABLE",
      value: [
        {
          id: "537306",
          value: {
            subTableFile: {
              type: "FILE",
              value: [fileInfo, fileInfo],
            },
          },
        },
        {
          id: "537307",
          value: {
            subTableFile: {
              type: "FILE",
              value: [fileInfo],
            },
          },
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
    subTable: {
      type: "SUBTABLE",
      value: [
        {
          id: "537308",
          value: {
            subTableFile: {
              type: "FILE",
              value: [fileInfo],
            },
          },
        },
      ],
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
    subTable: {
      type: "SUBTABLE",
      value: [
        {
          id: "537306",
          value: {
            subTableFile: {
              type: "FILE",
              value: [
                {
                  ...fileInfo,
                  localFilePath: path.join("subTableFile-2-0", "test.txt"),
                },
                {
                  ...fileInfo,
                  localFilePath: path.join("subTableFile-2-0", "test (1).txt"),
                },
              ],
            },
          },
        },
        {
          id: "537307",
          value: {
            subTableFile: {
              type: "FILE",
              value: [
                {
                  ...fileInfo,
                  localFilePath: path.join("subTableFile-2-1", "test.txt"),
                },
              ],
            },
          },
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
    subTable: {
      type: "SUBTABLE",
      value: [
        {
          id: "537308",
          value: {
            subTableFile: {
              type: "FILE",
              value: [
                {
                  ...fileInfo,
                  localFilePath: path.join("subTableFile-3-0", "test.txt"),
                },
              ],
            },
          },
        },
      ],
    },
  },
];
