import { KintoneRecordField } from "@kintone/rest-api-client";

export const jsonPrinter = (
  records: Array<{ [k: string]: KintoneRecordField.OneOf }>
) => {
  console.log(JSON.stringify(records, null, 2));
};
