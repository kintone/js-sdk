import { spawnSync } from "child_process";

const yarnCommand = process.platform === "win32" ? "yarn.cmd" : "yarn";

export const getWorkspacesInfo = () => {
  return JSON.parse(
    JSON.parse(
      spawnSync(yarnCommand, ["workspaces", "--json", "info"]).stdout.toString()
    ).data
  );
};
