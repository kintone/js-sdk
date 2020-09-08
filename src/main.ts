import yargs from "yargs";
import { exportRecords } from "./export";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";

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
        const apiClient = new KintoneRestAPIClient({
          baseUrl: argv.baseUrl,
          auth: {
            username: argv.username,
            password: argv.password,
          },
        });
        const records = await exportRecords(apiClient, argv);
        console.log(JSON.stringify(records));
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
  }).argv;
