import { KintoneAPIClient } from "../src/index";
import { Record } from "./record";

const client = new KintoneAPIClient({
  subdomain: process.env.KINTONE_SUBDOMAIN || "",
  auth: {
    apiToken: process.env.KINTONE_API_TOKEN || ""
  }
});

// @ts-ignore
({
  record: new Record(client)
}[process.argv[2]][process.argv[3]]());
