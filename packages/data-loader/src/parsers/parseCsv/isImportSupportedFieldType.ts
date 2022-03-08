import { KintoneFormFieldProperty } from "@kintone/rest-api-client";

export const isImportSupportedFieldType = (
  fieldType: KintoneFormFieldProperty.OneOf["type"]
): boolean => {
  const fieldTypes: Array<KintoneFormFieldProperty.OneOf["type"]> = [
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
  return fieldTypes.includes(fieldType);
};

export const isImportSupportedFieldTypeInSubtable = (
  fieldType: KintoneFormFieldProperty.InSubtable["type"]
): boolean => {
  const fieldTypes: Array<KintoneFormFieldProperty.InSubtable["type"]> = [
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
  ];
  return fieldTypes.includes(fieldType);
};
