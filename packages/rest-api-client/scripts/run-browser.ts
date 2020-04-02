import { KintoneRestAPIClient } from "../src/index.browser";
import { Record } from "./record";
import { App } from "./app";
import { File } from "./file";

declare const window: {
  KintoneRestAPIClientDemo: any;
};

const client = new KintoneRestAPIClient({
  baseUrl: process.env.KINTONE_BASE_URL || "",
  auth: {},
});

window.KintoneRestAPIClientDemo = {
  record: new Record(client),
  app: new App(client),
  file: new File(client),
};
