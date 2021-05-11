import { encloseInDoubleQuotes } from "./encloseInDoubleQuotes";
import { LINE_BREAK, PRIMARY_MARK, SEPARATOR } from "./constants";
import { extractFieldValue } from "./extractFieldValue";
import { buildHeaderFields } from "./buildHeaderFields";
import { hasSubtable } from "./hasSubtable";
import { FieldProperties, KintoneRecordForResponse } from "../../types";

type RowObject = {
  [fieldCode: string]: string | Array<{ [fieldCode: string]: string }>;
};

export const convertKintoneRecordsToCsv = ({
  records,
  fieldProperties,
}: {
  records: KintoneRecordForResponse[];
  fieldProperties: FieldProperties;
}) => {
  const headerFields = buildHeaderFields(fieldProperties);
  const rows = buildRows({
    records,
    headerFields,
    fieldProperties,
  });

  const headerRow = headerFields
    .map((fieldCode) => encloseInDoubleQuotes(fieldCode))
    .join(SEPARATOR);

  return [headerRow, ...rows].join(LINE_BREAK) + LINE_BREAK;
};

const buildRows = ({
  records,
  headerFields,
  fieldProperties,
}: {
  records: KintoneRecordForResponse[];
  headerFields: string[];
  fieldProperties: FieldProperties;
}) => {
  return records.map((record) =>
    buildRow({
      record,
      headerFields,
      fieldProperties,
    })
  );
};

const buildRow = ({
  record,
  headerFields,
  fieldProperties,
}: {
  record: KintoneRecordForResponse;
  headerFields: string[];
  fieldProperties: FieldProperties;
}) => {
  const recordObject = buildRecordObject(record);
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

const buildRecordObject = (record: KintoneRecordForResponse) => {
  return Object.keys(record).reduce<RowObject>((ret, fieldCode) => {
    return {
      ...ret,
      [fieldCode]: extractFieldValue(record[fieldCode]),
    };
  }, {});
};

const buildPrimaryRowObject = ({
  recordObject,
  fieldProperties,
}: {
  recordObject: RowObject;
  fieldProperties: FieldProperties;
}) => {
  return Object.keys(recordObject).reduce<RowObject>((ret, fieldCode) => {
    return {
      ...ret,
      ...(fieldProperties[fieldCode] &&
      fieldProperties[fieldCode].type !== "SUBTABLE"
        ? { [fieldCode]: recordObject[fieldCode] }
        : {}),
    };
  }, {});
};

const buildSubTableRowObjects = ({
  recordObject,
  subtableFieldCodes,
  primaryRowObject,
}: {
  recordObject: Record<string, any>;
  subtableFieldCodes: string[];
  primaryRowObject: RowObject;
}) => {
  const rowObjects = subtableFieldCodes.reduce<RowObject[]>(
    (ret, subtableFieldCode) => {
      return ret.concat(
        recordObject[subtableFieldCode].map(
          (field: { [k: string]: string }) => ({
            ...primaryRowObject,
            ...Object.keys(field).reduce<Record<string, string>>(
              (rowObject, fieldCode) => {
                return {
                  ...rowObject,
                  // NOTE: If fieldCode is `id`, use field code of subtable itself
                  // to avoid conflicts between each subtable.
                  [fieldCode === "id" ? subtableFieldCode : fieldCode]:
                    field[fieldCode],
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

const rowObjectToCsvRow = ({
  rowObject,
  headerFields,
}: {
  rowObject: RowObject;
  headerFields: string[];
}) => {
  return headerFields.map((fieldCode) => rowObject[fieldCode]).join(SEPARATOR);
};
