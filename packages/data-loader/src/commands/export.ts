import { run, ExportFileFormat } from "../controllers/export";
import * as yargs from "yargs";

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
    })
    // NOTE: Since yargs doesn't detect the type correctly by adding `demandOption: true` in `option()`,
    // (inferred type always contains `| undefined`)
    // related issue: https://github.com/yargs/yargs/issues/1928
    // we declare the required params later as a workaround.
    .demandOption(["base-url", "app"]);

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
    attachmentDir: args["attachment-dir"],
    format: args.format,
    query: args.query,
    pfxFilePath: args["pfx-file-path"],
    pfxFilePassword: args["pfx-file-password"],
  });
};
