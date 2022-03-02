export const isImportSupportedFieldType = (fieldType: string) => {
  return [
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
  ].includes(fieldType);
};
