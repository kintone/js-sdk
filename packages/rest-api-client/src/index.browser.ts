import { injectPlatformDeps } from "./platform/";
import * as browserDeps from "./platform/browser";

injectPlatformDeps(browserDeps);

export { KintoneRestAPIClient } from "./KintoneRestAPIClient";
export * as KintoneField from "./KintoneFields/exportTypes/field";
export * as KintoneLayout from "./KintoneFields/exportTypes/layout";
export * as KintoneProperty from "./KintoneFields/exportTypes/property";
