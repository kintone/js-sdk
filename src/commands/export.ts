import { run, Options } from "../controllers/export";
import { RestAPIClientOptions } from "../api";

type Argv = RestAPIClientOptions & Options;

export const command = "export";

export const desc = "export the records of the specified app";

export const builder = (yargs: any) =>
  yargs
    .option("base-url", {
      describe: "Kintone Base Url",
      default: process.env.KINTONE_BASE_URL,
      defaultDescription: "KINTONE_BASE_URL",
    })
    .option("username", {
      alias: "u",
      describe: "Kintone Username",
      default: process.env.KINTONE_USERNAME,
      defaultDescription: "KINTONE_USERNAME",
    })
    .option("password", {
      alias: "p",
      describe: "Kintone Password",
      default: process.env.KINTONE_PASSWORD,
      defaultDescription: "KINTONE_PASSWORD",
    })
    .option("api-token", {
      describe: "App's API token",
      default: process.env.KINTONE_API_TOKEN,
      defaultDescription: "KINTONE_API_TOKEN",
    })
    .option("basic-auth-username", {
      describe: "Kintone Basic Auth Username",
      default: process.env.KINTONE_BASIC_AUTH_USERNAME,
      defaultDescription: "KINTONE_BASIC_AUTH_USERNAME",
    })
    .option("basic-auth-password", {
      describe: "Kintone Basic Auth Password",
      default: process.env.KINTONE_BASIC_AUTH_PASSWORD,
      defaultDescription: "KINTONE_BASIC_AUTH_PASSWORD",
    })
    .option("app", {
      describe: "The ID of the app",
    })
    .option("guest-space-id", {
      describe: "The ID of guest space",
      default: process.env.KINTONE_GUEST_SPACE_ID,
      defaultDescription: "KINTONE_GUEST_SPACE_ID",
    })
    .option("attachment-dir", {
      describe: "Attachment file directory",
      type: "string",
    })
    .option("format", {
      describe: "Output format",
      default: "json",
    })
    .option("query", {
      alias: "q",
      describe: "The query string",
    })
    .option("pfx-file-path", {
      describe: "The path to client certificate file",
    })
    .option("pfx-file-password", {
      describe: "The password of client certificate file",
    });

export const handler = (argv: Argv) => run(argv);
