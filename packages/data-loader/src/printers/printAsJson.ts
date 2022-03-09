import { DataLoaderRecordForResponse } from "../types/data-loader";

export const printAsJson: (records: DataLoaderRecordForResponse[]) => void = (
  records
) => {
  console.log(JSON.stringify(records, null, 2));
};
