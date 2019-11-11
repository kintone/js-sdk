import { KintoneAPIClient } from "../src/index";
import { Record } from "./record";
import { App } from "./app";

declare const window: {
  KintoneAPIClientDemo: any;
};

const client = new KintoneAPIClient({
  subdomain: process.env.KINTONE_SUBDOMAIN || "",
  auth: {}
});

window.KintoneAPIClientDemo = {
  record: new Record(client),
  app: new App(client)
};
