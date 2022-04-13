import { RecordForImport } from "../../../../types/data-loader";
import { KintoneFormFieldProperty } from "@kintone/rest-api-client";
import path from "path";
import { KintoneRecordForParameter } from "../../../../types/kintone";

export const input: RecordForImport[] = [
  {
    singleLineText: {
      value: "value1",
    },
    table: {
      value: [
        {
          value: {
            attachmentInSubtable: {
              value: [
                {
                  localFilePath: path.join("attachment-1", "test.txt"),
                },
                {
                  localFilePath: path.join("attachment-1", "test (1).txt"),
                },
              ],
            },
          },
        },
      ],
    },
  },
];

export const expected: KintoneRecordForParameter[] = [
  {
    singleLineText: {
      value: "value1",
    },
    table: {
      value: [
        {
          id: undefined,
          value: {
            attachmentInSubtable: {
              value: [
                {
                  fileKey: "abcde",
                },
                {
                  fileKey: "fghij",
                },
              ],
            },
          },
        },
      ],
    },
  },
];

export const properties: Record<string, KintoneFormFieldProperty.OneOf> = {
  singleLineText: {
    type: "SINGLE_LINE_TEXT",
    code: "singleLineText",
    label: "singleLineText",
    noLabel: false,
    required: false,
    minLength: "",
    maxLength: "",
    expression: "",
    hideExpression: false,
    unique: false,
    defaultValue: "",
  },
  table: {
    type: "SUBTABLE",
    code: "table",
    noLabel: false,
    label: "table",
    fields: {
      attachmentInSubtable: {
        type: "FILE",
        code: "attachmentInSubtable",
        label: "attachmentInSubtable",
        noLabel: false,
        required: false,
        thumbnailSize: "150",
      },
    },
  },
};
