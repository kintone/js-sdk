import { ParsedRecord } from "./parseCsv";

export const parseJson = (jsonString: string) => {
  return JSON.parse(jsonString) as ParsedRecord[];
};
