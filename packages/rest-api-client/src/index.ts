import { injectPlatformDeps } from "./platform/";
import * as nodeDeps from "./platform/node";

injectPlatformDeps(nodeDeps);

export { KintoneRestAPIClient } from "./KintoneRestAPIClient";
export * from "./error";
export * as KintoneRecordField from "./KintoneFields/exportTypes/field";
export * as KintoneFormLayout from "./KintoneFields/exportTypes/layout";
export * as KintoneFormFieldProperty from "./KintoneFields/exportTypes/property";
