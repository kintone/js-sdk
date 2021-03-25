import { ParsedRecord } from "../types";

export const parseJson = (jsonString: string) => {
  return JSON.parse(jsonString) as ParsedRecord[];
};
