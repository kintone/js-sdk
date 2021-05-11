import { KintoneRecordField } from "@kintone/rest-api-client";

export const printAsJson = (
  records: Array<{ [k: string]: KintoneRecordField.OneOf }>
) => {
  console.log(JSON.stringify(records, null, 2));
};
