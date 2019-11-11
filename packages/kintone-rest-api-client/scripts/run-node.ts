import { KintoneAPIClient } from "../src/index";
import { Record } from "./record";
import { App } from "./app";

const client = new KintoneAPIClient({
  subdomain: process.env.KINTONE_SUBDOMAIN || "",
  auth: {
    apiToken: process.env.KINTONE_API_TOKEN || "",
    username: process.env.KINTONE_USERNAME || "",
    password: process.env.KINTONE_PASSWORD || ""
  }
});

// @ts-ignore
({
  record: new Record(client),
  app: new App(client)
}[process.argv[2]][process.argv[3]]());
