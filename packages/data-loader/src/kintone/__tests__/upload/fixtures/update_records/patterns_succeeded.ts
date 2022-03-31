import { KintoneRestAPIClient } from "@kintone/rest-api-client";

export const patterns: Array<{
  description: string;
  updateKey: string;
  expected: Parameters<KintoneRestAPIClient["record"]["updateRecords"]>[0];
}> = [
  {
    description: "should update records correctly with single line text",
    updateKey: "singleLineText",
    expected: {
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
  },
  {
    description: "should update records correctly with number",
    updateKey: "number",
    expected: {
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
  },
];
