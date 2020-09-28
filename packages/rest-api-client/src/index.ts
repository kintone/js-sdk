import { injectPlatformDeps } from "./platform/";
import * as nodeDeps from "./platform/node";

injectPlatformDeps(nodeDeps);

export { KintoneRestAPIClient } from "./KintoneRestAPIClient";
export * as KintoneRecordField from "./KintoneFields/exportTypes/field";
export * as KintoneFormLayout from "./KintoneFields/exportTypes/layout";
export * as KintoneFormProperty from "./KintoneFields/exportTypes/property";
