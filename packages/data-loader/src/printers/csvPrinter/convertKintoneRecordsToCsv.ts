import { FieldsJson, KintoneRecord } from "./index";
import { encloseInQuotation } from "./encloseInQuotation";
import { LINE_BREAK, PRIMARY_MARK, RECORD_INDEX, SEPARATOR } from "./constants";
import { extractFieldValue } from "./extractFieldValue";
import { buildHeaderFields } from "./buildHeaderFields";
import { hasSubTable } from "./hasSubTable";

export const convertKintoneRecordsToCsv = ({
  records,
  fieldsJson,
}: {
  records: KintoneRecord[];
  fieldsJson: FieldsJson;
}) => {
  const headerFields = buildHeaderFields(fieldsJson);
  const rows = buildRows({
    records,
    headerFields,
    fieldsJson,
  });

  const headerRow = headerFields
    .map((fieldCode) => encloseInQuotation(fieldCode))
    .join(SEPARATOR);

  return [headerRow, ...rows].join(LINE_BREAK) + LINE_BREAK;
};

const buildRows = ({
  records,
  headerFields,
  fieldsJson,
}: {
  records: KintoneRecord[];
  headerFields: string[];
  fieldsJson: FieldsJson;
}) => {
  return records.map((record, recordIndex) =>
    buildRow({
      record,
      headerFields,
      fieldsJson,
      recordIndex,
    })
  );
};

const buildRow = ({
  record,
  headerFields,
  fieldsJson,
  recordIndex,
}: {
  record: KintoneRecord;
  headerFields: string[];
  fieldsJson: FieldsJson;
  recordIndex: number;
}) => {
  const recordObject = buildRecordObject(record);
  const primaryRowObject = buildPrimaryRowObject({
    recordObject,
    fieldsJson,
  });

  if (!hasSubTable(fieldsJson)) {
    return rowObjectToCsvRow({ rowObject: primaryRowObject, headerFields });
  }

  const subTableFieldCodes = Object.keys(recordObject).filter(
    (fieldCode) =>
      fieldsJson.properties[fieldCode] &&
      fieldsJson.properties[fieldCode].type === "SUBTABLE"
  );

  const rowObjects = buildSubTableRowObjects({
    recordObject,
    subTableFieldCodes,
    primaryRowObject,
    recordIndex,
  });

  return rowObjects
    .map((rowObject) => rowObjectToCsvRow({ rowObject, headerFields }))
    .join(LINE_BREAK);
};

const buildRecordObject = (record: KintoneRecord) => {
  return Object.keys(record).reduce<Record<string, any>>((ret, fieldCode) => {
    return {
      ...ret,
      [fieldCode]: extractFieldValue(record[fieldCode]),
    };
  }, {});
};

const buildPrimaryRowObject = ({
  recordObject,
  fieldsJson,
}: {
  recordObject: Record<string, any>;
  fieldsJson: FieldsJson;
}) => {
  return Object.keys(recordObject).reduce<Record<string, string>>(
    (ret, fieldCode) => {
      return {
        ...ret,
        ...(fieldsJson.properties[fieldCode] &&
        fieldsJson.properties[fieldCode].type !== "SUBTABLE"
          ? { [fieldCode]: recordObject[fieldCode] }
          : {}),
      };
    },
    {}
  );
};

const buildSubTableRowObjects = ({
  recordObject,
  subTableFieldCodes,
  primaryRowObject,
  recordIndex,
}: {
  recordObject: Record<string, any>;
  subTableFieldCodes: string[];
  primaryRowObject: Record<string, string>;
  recordIndex: number;
}) => {
  const rowObjects = subTableFieldCodes.reduce<
    Array<{
      [fieldCode: string]: string;
    }>
  >((ret, subTableFieldCode) => {
    return ret.concat(
      recordObject[subTableFieldCode].map((field: { [k: string]: string }) => ({
        [RECORD_INDEX]: encloseInQuotation(recordIndex + 1 + ""),
        ...primaryRowObject,
        ...Object.keys(field).reduce<Record<string, string>>(
          (rowObject, fieldCode) => {
            return {
              ...rowObject,
              [`${subTableFieldCode}.${fieldCode}`]: field[fieldCode],
            };
          },
          {}
        ),
      }))
    );
  }, []);
  if (rowObjects.length !== 0) {
    rowObjects[0][PRIMARY_MARK] = PRIMARY_MARK;
  }
  return rowObjects;
};

const rowObjectToCsvRow = ({
  rowObject,
  headerFields,
}: {
  rowObject: Record<string, string>;
  headerFields: string[];
}) => {
  return headerFields.map((fieldCode) => rowObject[fieldCode]).join(SEPARATOR);
};
