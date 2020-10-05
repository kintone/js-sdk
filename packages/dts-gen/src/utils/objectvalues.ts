import { toPairs } from "lodash";

export function objectValues<T extends Record<string, any>>(
    object: T
) {
    return toPairs(object).map((entry) => entry[1]);
}
