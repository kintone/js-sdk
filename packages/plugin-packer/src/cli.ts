import meow from "meow";
import packerCli from "./packer-cli";

const USAGE = "$ kintone-plugin-packer [options] PLUGIN_DIR";

const cli = meow(
  `
Usage
  ${USAGE}

Options
  --ppk PPK_FILE: Private key file. If omitted, it's generated into '<Plugin ID>.ppk' in the same directory of PLUGIN_DIR.
  --out PLUGIN_FILE: The default is 'plugin.zip' in the same directory of PLUGIN_DIR.
  --watch: Watch PLUGIN_DIR for the changes.
`,
  {
    flags: {
      ppk: {
        type: "string",
      },
      out: {
        type: "string",
      },
      watch: {
        type: "boolean",
        alias: "w",
      },
    },
  },
);

const pluginDir = cli.input[0];

if (!pluginDir) {
  console.error("Error: An argument `PLUGIN_DIR` is required.");
  cli.showHelp();
}

const { ppk, out, watch } = cli.flags;

if (process.env.NODE_ENV === "test") {
  const flags: Record<string, string | boolean> = { watch: watch ?? false };
  if (ppk) {
    flags.ppk = ppk;
  }
  if (out) {
    flags.out = out;
  }
  console.log(JSON.stringify({ pluginDir, flags }));
} else {
  packerCli(pluginDir, { ppk, out, watch });
}
