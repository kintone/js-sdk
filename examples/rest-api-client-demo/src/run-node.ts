import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { loadProfile } from "@kintone/profile-loader";
import yargs from "yargs";
import { Record } from "./record";
import { App } from "./app";
import { File } from "./file";
import { BulkRequest } from "./bulkRequest";

const buildClient = (argv: any): KintoneRestAPIClient => {
  const config = loadProfile({ profile: argv.profile });
  // console.log(`target environment is ${config.baseUrl}`);
  const { apiToken, username, password, oAuthToken, baseUrl } = config;
  let auth;
  switch (argv.authType) {
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

  return new KintoneRestAPIClient({
    baseUrl: baseUrl || undefined,
    auth,
    featureFlags: {
      enableAbortSearchError: true,
    },
  });
};

const prepareMethod = (y: any) => {
  y.positional("method", {
    describe: "call method",
  });
};

// eslint-disable-next-line no-unused-expressions
yargs
  .command(
    "app [method]",
    "run script for AppClient",
    prepareMethod,
    (argv: any) => {
      // @ts-ignore
      new App(buildClient(argv))[argv.method]();
    },
  )
  .command(
    "record [method]",
    "run script for RecordClient",
    prepareMethod,
    (argv: any) => {
      // @ts-ignore
      new Record(buildClient(argv))[argv.method]();
    },
  )
  .command(
    "file [method]",
    "run script for FileClient",
    prepareMethod,
    (argv: any) => {
      // @ts-ignore
      new File(buildClient(argv))[argv.method]();
    },
  )
  .command(
    "bulkRequest [method]",
    "run script for bulkRequestClient",
    prepareMethod,
    (argv: any) => {
      // @ts-ignore
      new BulkRequest(buildClient(argv))[argv.method]();
    },
  )
  .option("authType", {
    desc: "Auth type",
    type: "string",
    default: "password",
  })
  .option("profile", {
    desc: "Profile",
    type: "string",
  }).argv;
