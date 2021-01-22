import { run, Argv } from "../controllers/import";

export const command = "import";

export const desc = "import the records of the specified app";

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
    .option("basic-auth-username", {
      describe: "Kintone Basic Auth Username",
      default: process.env.KINTONE_BASIC_AUTH_USERNAME,
    })
    .option("basic-auth-password", {
      describe: "Kintone Basic Auth Password",
      default: process.env.KINTONE_BASIC_AUTH_PASSWORD,
    })
    .option("app", {
      describe: "The ID of the app",
    })
    .option("id", {
      describe: "The ID of the record",
    })
    .option("guest-space-id", {
      describe: "The ID of guest space",
      default: process.env.KINTONE_GUEST_SPACE_ID,
    })
    .option("attachment-dir", {
      describe: "Attachment file directory",
      default: "attachments",
    })
    .option("file-path", {
      describe: "file path",
    }).argv;

export const handler = (argv: Argv) => run(argv);
