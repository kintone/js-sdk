import { KintoneRestAPIClient } from "../src/index";
import { Record } from "./record";
import { App } from "./app";
import { File } from "./file";

declare const window: {
  KintoneRestAPIClientDemo: any;
};

const client = new KintoneRestAPIClient({
  host: process.env.KINTONE_HOST || "",
  auth: {}
});

window.KintoneRestAPIClientDemo = {
  record: new Record(client),
  app: new App(client),
  file: new File(client)
};
