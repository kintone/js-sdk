import { KintoneRecordField } from "@kintone/rest-api-client";

export const jsonPrinter = ({
  records,
  exportFields,
}: {
  records: Array<{ [k: string]: KintoneRecordField.OneOf }>;
  exportFields?: string;
}) => {
  console.log(
    JSON.stringify(
      exportFields ? fieldsFilter({ records, exportFields }) : records,
      null,
      2
    )
  );
};
const fieldsFilter = ({
  records,
  exportFields,
}: {
  records: Array<{ [fieldCode: string]: KintoneRecordField.OneOf }>;
  exportFields: string;
}) => {
  return records.map((record) =>
    Object.keys(record)
      .filter((fieldCode) => exportFields.split(",").includes(fieldCode))
      .reduce<{ [fieldCode: string]: KintoneRecordField.OneOf }>(
        (ret, fieldCode) => ({
          ...ret,
          [fieldCode]: record[fieldCode],
        }),
        {}
      )
  );
};
