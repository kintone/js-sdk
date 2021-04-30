import { KintoneRecordForResponse } from "../types";

export const exportFieldsFilter = ({
  records,
  exportFields,
}: {
  records: KintoneRecordForResponse[];
  exportFields: string;
}) => {
  return records.map((record) =>
    Object.entries(record)
      .filter(([fieldCode]) => exportFields.split(",").includes(fieldCode))
      .reduce<KintoneRecordForResponse>(
        (kintoneRecordForResponse, [fieldCode, fieldValue]) => ({
          ...kintoneRecordForResponse,
          [fieldCode]: fieldValue,
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
