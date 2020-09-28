import yargs from "yargs";

// FIXME: It doesn't display an error when not passing any arguments.
// eslint-disable-next-line no-unused-expressions
yargs.commandDir("commands").demandCommand().help().argv;
