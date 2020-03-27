import { KintoneRestAPIClient } from "../src/index";
import { Record } from "./record";
import { App } from "./app";
import { File } from "./file";
import { BulkRequest } from "./bulkRequest";

const authType = process.argv[4] || "password";

const apiToken =
  process.env.KINTONE_API_TOKEN1 && process.env.KINTONE_API_TOKEN2
    ? [process.env.KINTONE_API_TOKEN1, process.env.KINTONE_API_TOKEN2]
    : process.env.KINTONE_API_TOKEN || "";
const username = process.env.KINTONE_USERNAME || "";
const password = process.env.KINTONE_PASSWORD || "";

const auth = authType === "apiToken" ? { apiToken } : { username, password };

const client = new KintoneRestAPIClient({
  baseUrl: process.env.KINTONE_BASE_URL || "",
  auth,
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
      file: new File(client),
    }[process.argv[2]][process.argv[3]]());
}
