import { KintoneAPIClient } from "../src/index";
import { Record } from "./record";
import { App } from "./app";

declare const window: {
  KintoneAPIClientDemo: any;
};

const client = new KintoneAPIClient({
  host: process.env.KINTONE_HOST || "",
  auth: {}
});

window.KintoneAPIClientDemo = {
  record: new Record(client),
  app: new App(client)
};
