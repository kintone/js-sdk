import { KintoneRecordField } from "@kintone/rest-api-client";

export const parseJson = (jsonString: string) => {
  return JSON.parse(jsonString) as Array<{
    [k: string]: KintoneRecordField.OneOf;
  }>;
};
