import { toPairs } from "lodash";

export const objectValues = <T extends Record<string, any>>(object: T) => {
  return toPairs(object).map((entry) => entry[1]);
};
