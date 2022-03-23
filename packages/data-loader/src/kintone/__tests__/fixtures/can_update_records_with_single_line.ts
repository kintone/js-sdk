import { RecordForImport } from "../../../types/data-loader";
import {
  KintoneFormFieldProperty,
  KintoneRestAPIClient,
} from "@kintone/rest-api-client";
import { KintoneRecordForParameter } from "../../../types/kintone";

export const input: RecordForImport[] = [
  {
    singleLineText: {
      value: "value1",
    },
    number: {
      value: "1",
    },
  },
  {
    singleLineText: {
      value: "value2",
    },
    number: {
      value: "2",
    },
  },
];

export const expectedParamsOfUpdateRecords: Parameters<
  KintoneRestAPIClient["record"]["updateRecords"]
> = [
  {
    app: "1",
    records: [
      {
        updateKey: {
          field: "singleLineText",
          value: "value1",
        },
        record: {
          number: {
            value: "1",
          },
        },
      },
      {
        updateKey: {
          field: "singleLineText",
          value: "value2",
        },
        record: {
          number: {
            value: "2",
          },
        },
      },
    ],
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
    unique: true,
    defaultValue: "",
  },
  number: {
    type: "NUMBER",
    code: "number",
    label: "number",
    noLabel: false,
    required: false,
    defaultValue: "",
    unique: false,
    minValue: "",
    maxValue: "",
    digit: true,
    displayScale: "",
    unit: "",
    unitPosition: "BEFORE",
  },
};
