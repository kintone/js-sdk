import { KintoneRecordField } from "@kintone/rest-api-client";

type KintoneRecords = Array<{ [k: string]: KintoneRecordField.OneOf }>;
const { EOL } = require("os");
const LINE_BREAK = EOL;
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

const escapeQuotation = (fieldValue: string) => fieldValue.replace(/"/g, '""');

const encloseInQuotation = (fieldValue: string | null) =>
  `"${fieldValue ? escapeQuotation(fieldValue) : ""}"`;

const extractFieldCodes = (records: KintoneRecords) => {
  const firstRecord = records.slice().shift();
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
      return encloseInQuotation(field.value);
    case "CREATOR":
    case "MODIFIER":
      return encloseInQuotation(field.value.code);
    case "MULTI_SELECT":
    case "CHECK_BOX":
      return encloseInQuotation(field.value.join(LINE_BREAK));
    default:
      return field.value;
  }
};

export const convertKintoneRecordsToCsv = (records: KintoneRecords) => {
  const fieldCodes = extractFieldCodes(records);

  const header = fieldCodes
    .map((fieldCode) => encloseInQuotation(fieldCode))
    .join(SEPARATOR);

  const rows = records
    .slice()
    .reverse()
    .map((record) => {
      return fieldCodes
        .map((fieldCode) => lexer(record[fieldCode]))
        .join(SEPARATOR);
    });

  return (
    [header, ...rows].join(LINE_BREAK).replace(/((?!.)\s)+/g, LINE_BREAK) +
    LINE_BREAK
  );
};

export const csvPrinter = (records: KintoneRecords) => {
  console.log(convertKintoneRecordsToCsv(records));
};
