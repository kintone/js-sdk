import { injectPlatformDeps } from "./platform/index.js";
import * as nodeDeps from "./platform/node.js";

injectPlatformDeps(nodeDeps);

export { KintoneRestAPIClient } from "./KintoneRestAPIClient.js";
export * from "./error/index.js";
export * as KintoneRecordField from "./KintoneFields/exportTypes/field.js";
export * as KintoneFormLayout from "./KintoneFields/exportTypes/layout.js";
export * as KintoneFormFieldProperty from "./KintoneFields/exportTypes/property.js";
