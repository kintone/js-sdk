import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { Record } from "./record";
import { App } from "./app";
import { File } from "./file";
import { Space } from "./space";

declare const window: {
  KintoneRestAPIClientDemo: any;
};

const client = new KintoneRestAPIClient({
  baseUrl: process.env.KINTONE_BASE_URL || "",
  auth: {},
  featureFlags: {
    enableAbortSearchError: true,
  },
});

window.KintoneRestAPIClientDemo = {
  record: new Record(client),
  app: new App(client),
  space: new Space(client),
  file: new File(client),
};
