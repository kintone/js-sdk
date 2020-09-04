import yargs from "yargs";
import { exportRecords, processRecord } from "./export";
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
          auth: {
            username: argv.username,
            password: argv.password,
          },
        });
        const records = await exportRecords(apiClient, argv.app, processRecord);
        console.log(JSON.stringify(records));
      } catch (e) {
        console.error(e);
      }
    }
  )
  .option("base-url", {
    describe: "Kintone Base Url",
  })
  .option("username", {
    alias: "u",
    describe: "Kintone Username",
  })
  .option("password", {
    alias: "p",
    describe: "Kintone Password",
  })
  .option("app", {
    describe: "The ID of the app",
  })
  .option("id", {
    describe: "The ID of the record",
  }).argv;
