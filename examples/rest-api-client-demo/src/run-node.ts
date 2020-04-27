import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { loadProfile } from "@kintone/profile-loader";
import { Record } from "./record";
import { App } from "./app";
import { File } from "./file";
import { BulkRequest } from "./bulkRequest";

const authType = process.argv[4] || "password";

const { apiToken, username, password, oAuthToken, baseUrl } = loadProfile();
console.log(loadProfile());

let auth;
switch (authType) {
  case "apiToken": {
    auth = { apiToken };
    break;
  }
  case "oAuthToken": {
    auth = { oAuthToken };
    break;
  }
  default: {
    auth = { username, password };
  }
}

const client = new KintoneRestAPIClient({
  baseUrl: baseUrl || undefined,
  auth,
});

// @ts-ignore
({
  record: new Record(client),
  app: new App(client),
  file: new File(client),
  bulkRequest: new BulkRequest(client),
}[process.argv[2]][process.argv[3]]());
