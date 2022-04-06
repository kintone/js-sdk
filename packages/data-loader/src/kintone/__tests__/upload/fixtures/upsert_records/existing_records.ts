import { KintoneRestAPIClient } from "@kintone/rest-api-client";

export const existingRecords: Awaited<
  ReturnType<KintoneRestAPIClient["record"]["getAllRecords"]>
> = [
  {
    singleLineText: {
      type: "SINGLE_LINE_TEXT",
      value: "value1",
    },
    number: {
      type: "NUMBER",
      value: "1",
    },
    date: {
      type: "DATE",
      value: "2022-03-01",
    },
  },
  {
    singleLineText: {
      type: "SINGLE_LINE_TEXT",
      value: "value2",
    },
    number: {
      type: "NUMBER",
      value: "2",
    },
    date: {
      type: "DATE",
      value: "2022-04-01",
    },
  },
];
