import { KintoneRecordForParameter } from "../types";

export const parseJson = (jsonString: string) => {
  return JSON.parse(jsonString) as KintoneRecordForParameter[];
};
