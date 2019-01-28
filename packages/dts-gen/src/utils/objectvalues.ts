import { toPairs } from "lodash";

export function objectValues(object: Object) {
    return toPairs(object).map(entry => entry[1]);
}
