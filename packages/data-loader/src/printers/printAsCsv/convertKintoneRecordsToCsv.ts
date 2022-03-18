import { encloseInDoubleQuotes } from "./encloseInDoubleQuotes";
import { LINE_BREAK, PRIMARY_MARK, SEPARATOR } from "./constants";
import { extractFieldValue } from "./extractFieldValue";
import { buildHeaderFields } from "./buildHeaderFields";
import { hasSubtable } from "./hasSubtable";
import { FieldProperties } from "../../types/kintone";
import { RecordForExport } from "../../types/data-loader";

type RowObject = {
  [fieldCode: string]: string | Array<{ [fieldCode: string]: string }>;
};

export const convertRecordsToCsv: (options: {
  records: RecordForExport[];
  fieldProperties: FieldProperties;
  attachmentsDir?: string;
}) => string = (options) => {
  const { records, fieldProperties, attachmentsDir } = options;

  const headerFields = buildHeaderFields(fieldProperties);
  const headerRow = headerFields
    .map((fieldCode) => encloseInDoubleQuotes(fieldCode))
    .join(SEPARATOR);
  const rows = buildRows({
    records,
    headerFields,
    fieldProperties,
    attachmentsDir,
  });

  return [headerRow, ...rows].join(LINE_BREAK) + LINE_BREAK;
};

const buildRows: (options: {
  records: RecordForExport[];
  headerFields: string[];
  fieldProperties: FieldProperties;
  attachmentsDir?: string;
}) => string[] = (options) => {
  const { records, headerFields, fieldProperties, attachmentsDir } = options;
  return records.map((record) =>
    buildRow({
      record,
      headerFields,
      fieldProperties,
      attachmentsDir,
    })
  );
};

const buildRow: (options: {
  record: RecordForExport;
  headerFields: string[];
  fieldProperties: FieldProperties;
  attachmentsDir?: string;
}) => string = (options) => {
  const { record, headerFields, fieldProperties, attachmentsDir } = options;
  const recordObject = buildRecordObject({ record, attachmentsDir });
  const primaryRowObject = buildPrimaryRowObject({
    recordObject,
    fieldProperties,
  });

  if (!hasSubtable(fieldProperties)) {
    return rowObjectToCsvRow({ rowObject: primaryRowObject, headerFields });
  }

  const subtableFieldCodes = Object.keys(recordObject).filter(
    (fieldCode) =>
      fieldProperties[fieldCode] &&
      fieldProperties[fieldCode].type === "SUBTABLE"
  );

  const rowObjects = buildSubTableRowObjects({
    recordObject,
    subtableFieldCodes,
    primaryRowObject,
  });

  return rowObjects
    .map((rowObject) => rowObjectToCsvRow({ rowObject, headerFields }))
    .join(LINE_BREAK);
};

const buildRecordObject: (options: {
  record: RecordForExport;
  attachmentsDir?: string;
}) => RowObject = (options) => {
  const { record, attachmentsDir } = options;
  return Object.entries(record).reduce<RowObject>((row, [fieldCode, field]) => {
    return {
      ...row,
      [fieldCode]: extractFieldValue(field, attachmentsDir),
    };
  }, {});
};

const buildPrimaryRowObject: (options: {
  recordObject: RowObject;
  fieldProperties: FieldProperties;
}) => RowObject = (options) => {
  const { recordObject, fieldProperties } = options;
  return Object.entries(recordObject).reduce<RowObject>(
    (row, [fieldCode, field]) => {
      return {
        ...row,
        ...(fieldProperties[fieldCode] &&
        fieldProperties[fieldCode].type !== "SUBTABLE"
          ? { [fieldCode]: field }
          : {}),
      };
    },
    {}
  );
};

const buildSubTableRowObjects: (options: {
  recordObject: Record<string, any>;
  subtableFieldCodes: string[];
  primaryRowObject: RowObject;
}) => RowObject[] = (options) => {
  const { recordObject, subtableFieldCodes, primaryRowObject } = options;
  const rowObjects = subtableFieldCodes.reduce<RowObject[]>(
    (row, subtableFieldCode) => {
      return recordObject[subtableFieldCode].length === 0
        ? [primaryRowObject]
        : row.concat(
            recordObject[subtableFieldCode].map(
              (subtableRow: { [k: string]: string }) => ({
                ...primaryRowObject,
                ...Object.entries(subtableRow).reduce<Record<string, string>>(
                  (rowObject, [fieldCodeInSubtable, fieldInSubtable]) => {
                    return {
                      ...rowObject,
                      // NOTE: If fieldCode is `id`, use field code of subtable itself
                      // to avoid conflicts between each subtable.
                      [fieldCodeInSubtable === "id"
                        ? subtableFieldCode
                        : fieldCodeInSubtable]: fieldInSubtable,
                    };
                  },
                  {}
                ),
              })
            )
          );
    },
    []
  );
  if (rowObjects.length !== 0) {
    rowObjects[0][PRIMARY_MARK] = PRIMARY_MARK;
  }
  return rowObjects;
};

const rowObjectToCsvRow: (options: {
  rowObject: RowObject;
  headerFields: string[];
}) => string = (options) => {
  const { rowObject, headerFields } = options;
  return headerFields.map((fieldCode) => rowObject[fieldCode]).join(SEPARATOR);
};
