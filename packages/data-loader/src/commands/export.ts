import { run } from "../controllers/export";
import * as yargs from "yargs";
import { ExportFileFormat } from "../printers";

const formats: ExportFileFormat[] = ["json", "csv"];

export const command = "export";

export const desc = "export the records of the specified app";

export const builder = (args: yargs.Argv) =>
  args
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
    .option("attachments-dir", {
      describe: "Attachment file directory",
      type: "string",
    })
    .option("format", {
      describe: 'Output format. "json" or "csv"',
      default: "json" as ExportFileFormat,
      choices: formats,
    })
    .option("condition", {
      alias: "c",
      describe: "The query string",
      type: "string",
    })
    .option("order-by", {
      description: "The sort order as a query",
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

type Args = yargs.Arguments<
  ReturnType<typeof builder> extends yargs.Argv<infer U> ? U : never
>;

export const handler = (args: Args) => {
  return run({
    baseUrl: args["base-url"],
    username: args.username,
    password: args.password,
    apiToken: args["api-token"],
    basicAuthUsername: args["basic-auth-username"],
    basicAuthPassword: args["basic-auth-password"],
    app: args.app,
    guestSpaceId: args["guest-space-id"],
    attachmentsDir: args["attachments-dir"],
    format: args.format,
    condition: args.condition,
    orderBy: args["order-by"],
    pfxFilePath: args["pfx-file-path"],
    pfxFilePassword: args["pfx-file-password"],
  });
};
