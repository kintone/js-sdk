import yargs from "yargs";
import * as commandExport from "./commands/export";
import * as commandImport from "./commands/import";

// eslint-disable-next-line no-unused-expressions
yargs
  .command(commandExport)
  .command(commandImport)
  .demandCommand()
  .strict()
  .help().argv;
