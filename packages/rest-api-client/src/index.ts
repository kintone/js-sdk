import { injectPlatformDeps } from "./platform/";
import * as nodeDeps from "./platform/node";
import * as KintoneField from "./KintoneFields/types/field";
import * as KintoneLayout from "./KintoneFields/types/layout";
import * as KintoneProperty from "./KintoneFields/types/property";

injectPlatformDeps(nodeDeps);

export { KintoneRestAPIClient } from "./KintoneRestAPIClient";
export const KintoneFields = {
  ...KintoneField,
  ...KintoneLayout,
  ...KintoneProperty,
};
