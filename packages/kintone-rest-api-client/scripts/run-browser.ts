import { KintoneAPIClient } from "../src/index";
import { Record } from "./record";

declare const window: {
  KintoneAPIClient: any;
};

const client = new KintoneAPIClient({
  subdomain: process.env.KINTONE_SUBDOMAIN || "",
  auth: {}
});

window.KintoneAPIClient = {
  record: new Record(client)
};
