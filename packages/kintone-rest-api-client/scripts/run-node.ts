import { KintoneAPIClient } from "../src/index";
import { Record } from "./record";
import { App } from "./app";
import { File } from "./file";
import { BulkRequest } from "./bulkRequest";

const client = new KintoneAPIClient({
  host: process.env.KINTONE_HOST || "",
  auth: {
    apiToken: process.env.KINTONE_API_TOKEN || "",
    username: process.env.KINTONE_USERNAME || "",
    password: process.env.KINTONE_PASSWORD || ""
  }
});

switch (process.argv[2]) {
  case "bulkRequest":
    new BulkRequest(client).run();
    break;
  default:
    // @ts-ignore
    ({
      record: new Record(client),
      app: new App(client),
      file: new File(client)
    }[process.argv[2]][process.argv[3]]());
}
