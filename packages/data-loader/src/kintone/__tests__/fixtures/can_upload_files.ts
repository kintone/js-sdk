import { DataLoaderRecordForParameter } from "../../../types/data-loader";
import { KintoneFormFieldProperty } from "@kintone/rest-api-client";
import path from "path";
import { KintoneRecordForParameter } from "../../../types/kintone";

export const input: DataLoaderRecordForParameter[] = [
  {
    singleLineText: {
      value: "value1",
    },
    attachment: {
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
];

export const expected: KintoneRecordForParameter[] = [
  {
    singleLineText: {
      value: "value1",
    },
    attachment: {
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
  attachment: {
    type: "FILE",
    code: "file",
    label: "file",
    noLabel: false,
    required: false,
    thumbnailSize: "150",
  },
};
