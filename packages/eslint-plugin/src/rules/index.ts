import { rule as onlyAllowedJsApi } from "./only-allowed-js-api.js";
import { rule as noCybozuData } from "./no-cybozu-data.js";
import { rule as noKintoneInternalSelector } from "./no-kintone-internal-selector.js";

export const rules = {
  "only-allowed-js-api": onlyAllowedJsApi,
  "no-cybozu-data": noCybozuData,
  "no-kintone-internal-selector": noKintoneInternalSelector,
};
