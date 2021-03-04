import { KintoneFormFieldProperty } from "@kintone/rest-api-client";

const supportedFieldTypes = [
  "RECORD_NUMBER",
  "SINGLE_LINE_TEXT",
  "RADIO_BUTTON",
  "MULTI_LINE_TEXT",
  "NUMBER",
  "RICH_TEXT",
  "LINK",
  "DROP_DOWN",
  "CALC",
  "CREATOR",
  "MODIFIER",
  "UPDATED_TIME",
  "CREATED_TIME",
  "MULTI_SELECT",
  "CHECK_BOX",
  "SUBTABLE",
];

export const isSupportedFieldType = (field: KintoneFormFieldProperty.OneOf) =>
  supportedFieldTypes.includes(field.type);
