import { run, Options, ExportFileFormat } from "../controllers/export";
import { RestAPIClientOptions } from "../api";

type Argv = RestAPIClientOptions & Options;

const formats: ExportFileFormat[] = ["json", "csv"];

export const command = "export";

export const desc = "export the records of the specified app";

export const builder = (yargs: any) =>
  yargs
    .option("base-url", {
      describe: "Kintone Base Url",
      default: process.env.KINTONE_BASE_URL,
      defaultDescription: "KINTONE_BASE_URL",
      type: "string",
      demandOption: true,
    })
    .option("username", {
      alias: "u",
      describe: "Kintone Username",
      default: process.env.KINTONE_USERNAME,
      defaultDescription: "KINTONE_USERNAME",
      type: "string",
    })
    .option("password", {
      alias: "p",
      describe: "Kintone Password",
      default: process.env.KINTONE_PASSWORD,
      defaultDescription: "KINTONE_PASSWORD",
      type: "string",
    })
    .option("api-token", {
      describe: "App's API token",
      default: process.env.KINTONE_API_TOKEN,
      defaultDescription: "KINTONE_API_TOKEN",
      type: "array",
    })
    .option("basic-auth-username", {
      describe: "Kintone Basic Auth Username",
      default: process.env.KINTONE_BASIC_AUTH_USERNAME,
      defaultDescription: "KINTONE_BASIC_AUTH_USERNAME",
      type: "string",
    })
    .option("basic-auth-password", {
      describe: "Kintone Basic Auth Password",
      default: process.env.KINTONE_BASIC_AUTH_PASSWORD,
      defaultDescription: "KINTONE_BASIC_AUTH_PASSWORD",
      type: "string",
    })
    .option("app", {
      describe: "The ID of the app",
      type: "string",
      demandOption: true,
    })
    .option("guest-space-id", {
      describe: "The ID of guest space",
      default: process.env.KINTONE_GUEST_SPACE_ID,
      defaultDescription: "KINTONE_GUEST_SPACE_ID",
      type: "string",
    })
    .option("attachment-dir", {
      describe: "Attachment file directory",
      type: "string",
    })
    .option("format", {
      describe: 'Output format. "json" or "csv"',
      default: "json" as ExportFileFormat,
      choices: formats,
    })
    .option("query", {
      alias: "q",
      describe: "The query string",
      type: "string",
    })
    .option("pfx-file-path", {
      describe: "The path to client certificate file",
      type: "string",
    })
    .option("pfx-file-password", {
      describe: "The password of client certificate file",
      type: "string",
    });

export const handler = (argv: Argv) => run(argv);
