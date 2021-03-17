import { KintoneRecordField } from "@kintone/rest-api-client";

type KintoneRecords = Array<{ [k: string]: KintoneRecordField.OneOf }>;

const LINE_BREAK = "\n";
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
    "CREATOR",
    "MODIFIER",
    "UPDATED_TIME",
    "CREATED_TIME",
    "MULTI_SELECT",
    "CHECK_BOX",
  ];
  return supportedFieldTypes.includes(field.type);
};

const escapeDoubleQuotes = (fieldValue: string) =>
  fieldValue.replace(/"/g, '""');

const encloseInDoubleQuotes = (fieldValue: string | null) =>
  `"${fieldValue ? escapeDoubleQuotes(fieldValue) : ""}"`;

const extractFieldCodes = (records: KintoneRecords) => {
  const firstRecord = Array.isArray(records) && records[0];
  if (!firstRecord) return [];
  return Object.keys(firstRecord).filter((key) =>
    isSupportedFieldType(firstRecord[key])
  );
};

const lexer = (field: KintoneRecordField.OneOf) => {
  switch (field.type) {
    case "RECORD_NUMBER":
    case "SINGLE_LINE_TEXT":
    case "RADIO_BUTTON":
    case "MULTI_LINE_TEXT":
    case "NUMBER":
    case "RICH_TEXT":
    case "LINK":
    case "DROP_DOWN":
    case "CALC":
    case "UPDATED_TIME":
    case "CREATED_TIME":
      return encloseInDoubleQuotes(field.value);
    case "CREATOR":
    case "MODIFIER":
      return encloseInDoubleQuotes(field.value.code);
    case "MULTI_SELECT":
    case "CHECK_BOX":
      return encloseInDoubleQuotes(field.value.join(LINE_BREAK));
    default:
      // never reach the default
      return field.value;
  }
};

export const convertKintoneRecordsToCsv = (records: KintoneRecords) => {
  const fieldCodes = extractFieldCodes(records);

  const header = fieldCodes
    .map((fieldCode) => encloseInDoubleQuotes(fieldCode))
    .join(SEPARATOR);

  const rows = records.map((record) => {
    return fieldCodes
      .map((fieldCode) => lexer(record[fieldCode]))
      .join(SEPARATOR);
  });
  return addNewLineAtEof(unifyLineBreak([header, ...rows].join(LINE_BREAK)));
};

const unifyLineBreak = (str: string) => {
  return str.replace(/\r?\n/g, LINE_BREAK);
};

const addNewLineAtEof = (str: string) => str + LINE_BREAK;

export const csvPrinter = (records: KintoneRecords) => {
  console.log(convertKintoneRecordsToCsv(records));
};
