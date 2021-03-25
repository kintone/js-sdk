import { KintoneRecordField } from "@kintone/rest-api-client";
import { KintoneRecord } from "../types";

const fieldsFilter = ({
  records,
  exportFields,
}: {
  records: KintoneRecord[];
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

export const printAsJson = ({
  records,
  exportFields,
}: {
  records: KintoneRecord[];
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
