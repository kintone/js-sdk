import { KintoneRecordForParameter } from "../types/kintone";

export const parseJson = (jsonString: string) => {
  return JSON.parse(jsonString) as KintoneRecordForParameter[];
};
