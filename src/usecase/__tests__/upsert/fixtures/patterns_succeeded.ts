import { KintoneRestAPIClient } from "@kintone/rest-api-client";

export const patterns: Array<{
  description: string;
  updateKey: string;
  forUpdateExpected: Parameters<
    KintoneRestAPIClient["record"]["updateAllRecords"]
  >[0];
  forAddExpected: Parameters<
    KintoneRestAPIClient["record"]["addAllRecords"]
  >[0];
}> = [
  {
    description: "should upsert records correctly with single line text",
    updateKey: "singleLineText",
    forUpdateExpected: {
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
      ],
    },
    forAddExpected: {
      app: "1",
      records: [
        {
          singleLineText: {
            value: "value3",
          },
          number: {
            value: "3",
          },
          date: {
            value: "2022-04-01",
          },
        },
      ],
    },
  },
  {
    description: "should upsert records correctly with number",
    updateKey: "number",
    forUpdateExpected: {
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
      ],
    },
    forAddExpected: {
      app: "1",
      records: [
        {
          singleLineText: {
            value: "value3",
          },
          number: {
            value: "3",
          },
          date: {
            value: "2022-04-01",
          },
        },
      ],
    },
  },
];
