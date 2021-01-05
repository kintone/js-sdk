import module from "module";
// eslint-disable-next-line node/no-unsupported-features/node-builtins
const require = module.createRequire(import.meta.url);

export const {
  KintoneRestAPIClient,
  KintoneAbortSearchError,
  KintoneAllRecordsError,
  KintoneRestAPIError,
} = require(".");
