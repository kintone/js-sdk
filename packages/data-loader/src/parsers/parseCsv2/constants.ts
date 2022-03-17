import { KintoneFormFieldProperty } from "@kintone/rest-api-client";

export const importSupportedFieldTypes: Array<
  KintoneFormFieldProperty.OneOf["type"]
> = [
  "SINGLE_LINE_TEXT",
  "RADIO_BUTTON",
  "MULTI_LINE_TEXT",
  "NUMBER",
  "RICH_TEXT",
  "LINK",
  "DROP_DOWN",
  "UPDATED_TIME",
  "CREATED_TIME",
  "CREATOR",
  "MODIFIER",
  "MULTI_SELECT",
  "CHECK_BOX",
  "USER_SELECT",
  "ORGANIZATION_SELECT",
  "GROUP_SELECT",
  "FILE",
];

export const importSupportedFieldTypesInSubtable: Array<
  KintoneFormFieldProperty.InSubtable["type"]
> = [
  "SINGLE_LINE_TEXT",
  "RADIO_BUTTON",
  "MULTI_LINE_TEXT",
  "NUMBER",
  "RICH_TEXT",
  "LINK",
  "DROP_DOWN",
  "MULTI_SELECT",
  "CHECK_BOX",
  "USER_SELECT",
  "ORGANIZATION_SELECT",
  "GROUP_SELECT",
  "FILE",
];
