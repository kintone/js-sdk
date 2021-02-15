import { KintoneRecordField } from "@kintone/rest-api-client";

type KintoneRecords = Array<{ [k: string]: KintoneRecordField.OneOf }>;

const LINE_BREAK = "\r\n";
const SEPARATOR = ",";

const isSupportedFieldType = (field: KintoneRecordField.OneOf) => {
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
  ];
  return supportedFieldTypes.includes(field.type);
};

const lexer = (field: KintoneRecordField.OneOf) => {
  switch (field.type) {
    case "RECORD_NUMBER":
    case "SINGLE_LINE_TEXT":
    case "RADIO_BUTTON":
    case "MULTI_LINE_TEXT":
    case "NUMBER":
    case "LINK":
    case "DROP_DOWN":
    case "CALC":
      return encloseInQuotation(field.value);
    default:
      return field.value;
  }
};

const escapeQuotation = (value: string) => value.replace(/"/g, '""');

const encloseInQuotation = (value: string | null) =>
  value ? `"${escapeQuotation(value)}"` : "";

const extractFieldCodes = (records: KintoneRecords) => {
  const firstRecord = records[0];
  return Object.keys(firstRecord).filter((key) =>
    isSupportedFieldType(firstRecord[key])
  );
};

export const fromJSON = (records: KintoneRecords) => {
  const fieldCodes = extractFieldCodes(records);

  const header = fieldCodes
    .map((fieldCode) => encloseInQuotation(fieldCode))
    .join(SEPARATOR);

  const rows = records.map((record) => {
    return fieldCodes
      .map((fieldCode) => lexer(record[fieldCode]))
      .join(SEPARATOR);
  });

  return [header, ...rows].join(LINE_BREAK);
};
