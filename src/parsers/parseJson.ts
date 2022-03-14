import { DataLoaderRecordForParameter } from "../types/data-loader";

export const parseJson = (jsonString: string) => {
  return JSON.parse(jsonString) as DataLoaderRecordForParameter[];
};
