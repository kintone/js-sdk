import { injectPlatformDeps } from "./platform/";
import * as nodeDeps from "./platform/node";

injectPlatformDeps(nodeDeps);

export { KintoneRestAPIClient } from "./KintoneRestAPIClient";
export * as KintoneField from "./KintoneFields/exportTypes/field";
export * as KintoneLayout from "./KintoneFields/exportTypes/layout";
export * as KintoneProperty from "./KintoneFields/exportTypes/property";
