import { RecordForExport } from "../types/data-loader";

export const printAsJson: (records: RecordForExport[]) => void = (records) => {
  console.log(JSON.stringify(records, null, 2));
};
