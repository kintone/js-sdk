import { KintoneRecordField } from "@kintone/rest-api-client";
import { KintoneRecordForResponse } from "../types";

export const exportFieldsFilter = ({
  records,
  exportFields,
}: {
  records: KintoneRecordForResponse[];
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
  records: KintoneRecordForResponse[];
  exportFields?: string;
}) => {
  console.log(
    JSON.stringify(
      exportFields ? exportFieldsFilter({ records, exportFields }) : records,
      null,
      2
    )
  );
};
