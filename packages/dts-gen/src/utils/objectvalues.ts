import { toPairs } from "lodash";

export function objectValues(
    object: Record<string, unknown>
) {
    return toPairs(object).map((entry) => entry[1]);
}
