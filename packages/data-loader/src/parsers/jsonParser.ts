import { ParsedRecord } from "./csvParser";

export const parseJson = (jsonString: string) => {
  return JSON.parse(jsonString) as ParsedRecord[];
};
