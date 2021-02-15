import { KintoneRecordField } from "@kintone/rest-api-client";
import { format } from "util";

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
    "CREATOR",
    "MODIFIER",
    "UPDATED_TIME",
    "CREATED_TIME",
  ];
  return supportedFieldTypes.includes(field.type);
};

const zeroPad = (num: number) => (num + "").padStart(2, "0");

/**
 * format date to "YYYY/MM/DD HH:mm"
 * @param dateString
 */
const formatDateFieldValue = (dateString: string) => {
  const date = new Date(dateString);
  return format(
    "%d/%d/%d %d:%d",
    date.getFullYear(),
    zeroPad(date.getMonth() + 1),
    zeroPad(date.getDate()),
    zeroPad(date.getHours()),
    zeroPad(date.getMinutes())
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
      return encloseInQuotation(field.value);
    case "CREATOR":
    case "MODIFIER":
      return encloseInQuotation(field.value.code);
    case "UPDATED_TIME":
    case "CREATED_TIME":
      return encloseInQuotation(formatDateFieldValue(field.value));
    default:
      return field.value;
  }
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

export const fromJSON = (records: KintoneRecords) => {
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

  return [header, ...rows].join(LINE_BREAK);
};
