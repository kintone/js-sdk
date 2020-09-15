import yargs from "yargs";
import { exportRecords } from "./commands/export";
import { buildRestAPIClient } from "./api";
import { buildPrinter } from "./printer";
import { importRecords } from "./commands/import";

// FIXME: It doesn't display an error when not passing any arguments.
// eslint-disable-next-line no-unused-expressions
yargs
  .command(
    "export",
    "export the records of the specified app",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => {},
    async (argv: any) => {
      try {
        const apiClient = buildRestAPIClient(argv);
        const records = await exportRecords(apiClient, argv);
        const printer = buildPrinter(argv.format);
        printer(records);
      } catch (e) {
        console.error(e);
      }
    }
  )
  .command(
    "import",
    "import the records of the specified app",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => {},
    async (argv: any) => {
      try {
        const apiClient = buildRestAPIClient(argv);
        await importRecords(apiClient, argv);
      } catch (e) {
        console.error(e);
      }
    }
  )
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
  })
  .option("file-path", {
    describe: "file path",
  }).argv;
