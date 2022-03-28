import { RecordForImport } from "../../../types/data-loader";
import {
  KintoneFormFieldProperty,
  KintoneRestAPIClient,
} from "@kintone/rest-api-client";

export const input: RecordForImport[] = [
  {
    singleLineText: {
      value: "value1",
    },
    number: {
      value: "1",
    },
    date: {
      value: "2022-03-01",
    },
  },
  {
    singleLineText: {
      value: "value2",
    },
    number: {
      value: "2",
    },
    date: {
      value: "2022-04-01",
    },
  },
];

export const expectedParamsOfUpdateRecordsBySingleLineText: Parameters<
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
          date: {
            value: "2022-03-01",
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
          date: {
            value: "2022-04-01",
          },
        },
      },
    ],
  },
];

export const expectedParamsOfUpdateRecordsByNumber: Parameters<
  KintoneRestAPIClient["record"]["updateRecords"]
> = [
  {
    app: "1",
    records: [
      {
        updateKey: {
          field: "number",
          value: "1",
        },
        record: {
          singleLineText: {
            value: "value1",
          },
          date: {
            value: "2022-03-01",
          },
        },
      },
      {
        updateKey: {
          field: "number",
          value: "2",
        },
        record: {
          singleLineText: {
            value: "value2",
          },
          date: {
            value: "2022-04-01",
          },
        },
      },
    ],
  },
];

export const expectedParamsOfUpdateRecordsByUnsupportedField: Parameters<
  KintoneRestAPIClient["record"]["updateRecords"]
> = [
  {
    app: "1",
    records: [
      {
        updateKey: {
          field: "date",
          value: "2022-03-01",
        },
        record: {
          singleLineText: {
            value: "value1",
          },
          number: {
            value: "1",
          },
        },
      },
      {
        updateKey: {
          field: "date",
          value: "2022-04-01",
        },
        record: {
          singleLineText: {
            value: "value2",
          },
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
    required: true,
    minValue: "",
    maxValue: "",
    digit: false,
    unique: true,
    defaultValue: "",
    displayScale: "",
    unit: "",
    unitPosition: "BEFORE",
  },
  singleLineText_nonUnique: {
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
  date: {
    type: "DATE",
    code: "date",
    label: "date",
    noLabel: false,
    required: false,
    unique: false,
    defaultValue: "",
    defaultNowValue: true,
  },
};
