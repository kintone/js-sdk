import { run, Argv } from "../controllers/export";

export const command = "export";

export const desc = "export the records of the specified app";

export const builder = (yargs: any) =>
  yargs
    .option("base-url", {
      describe: "Kintone Base Url",
      default: process.env.KINTONE_BASE_URL,
    })
    .option("username", {
      alias: "u",
      describe: "Kintone Username",
      default: process.env.KINTONE_USERNAME,
    })
    .option("password", {
      alias: "p",
      describe: "Kintone Password",
      default: process.env.KINTONE_PASSWORD,
    })
    .option("app", {
      describe: "The ID of the app",
    })
    .option("id", {
      describe: "The ID of the record",
    })
    .option("attachment-dir", {
      describe: "Attachment file directory",
      default: "attachments",
    })
    .option("format", {
      describe: "Output format",
      default: "json",
    });

export const handler = (argv: Argv) => run(argv);
