import { DataLoaderRecord } from "../types/data-loader";

export const printAsJson: (records: DataLoaderRecord[]) => void = (records) => {
  console.log(JSON.stringify(records, null, 2));
};
