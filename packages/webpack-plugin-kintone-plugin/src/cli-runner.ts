import path from "path";
import type { SpawnOptions } from "child_process";
import { spawn } from "child_process";

/**
 * Get the path to cli-kintone CLI script
 */
const getCliKintonePath = (): string => {
  const cliPackagePath = require.resolve("@kintone/cli/package.json");
  return path.join(path.dirname(cliPackagePath), "cli.js");
};

/**
 * Execute cli-kintone command and return stdout
 */
const runCliKintone = (
  args: string[],
  options: SpawnOptions = {},
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const cliPath = getCliKintonePath();
    const child = spawn(process.execPath, [cliPath, ...args], {
      stdio: ["inherit", "pipe", "pipe"],
      ...options,
    });

    const stdoutChunks: string[] = [];
    const stderrChunks: string[] = [];

    child.stdout?.setEncoding("utf-8");
    child.stderr?.setEncoding("utf-8");

    child.stdout?.on("data", (data: string) => {
      stdoutChunks.push(data);
    });

    child.stderr?.on("data", (data: string) => {
      stderrChunks.push(data);
    });

    child.on("close", (code) => {
      const stdout = stdoutChunks.join("");
      const stderr = stderrChunks.join("");
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(
          new Error(
            `cli-kintone exited with code ${code}\nstdout: ${stdout}\nstderr: ${stderr}`,
          ),
        );
      }
    });

    child.on("error", (err) => {
      reject(err);
    });
  });
};

/**
 * Get plugin ID from a plugin zip file
 * @param pluginZipPath Path to the plugin zip file
 * @returns Plugin ID
 */
export const getPluginId = async (pluginZipPath: string): Promise<string> => {
  const stdout = await runCliKintone([
    "plugin",
    "info",
    "--input",
    path.resolve(pluginZipPath),
    "--format",
    "json",
  ]);

  try {
    const info: { id: string } = JSON.parse(stdout);
    return info.id;
  } catch {
    throw new Error(`Failed to parse plugin info JSON: ${stdout}`);
  }
};

/**
 * Pack a kintone plugin using cli-kintone
 * @param manifestJSONPath Path to manifest.json
 * @param privateKeyPath Path to private key file
 * @param outputPath Path for output zip file
 */
export const packPlugin = async (
  manifestJSONPath: string,
  privateKeyPath: string,
  outputPath: string,
): Promise<void> => {
  // Note: cli-kintone skips actual packing when NODE_ENV=test,
  // so we need to override it to ensure the pack command runs.
  // ref: https://github.com/kintone/cli-kintone/blob/a17e3a2c0f1b0c5eef55f61ab652d01ae8c5f791/src/cli/plugin/pack.ts#L53-L57
  const env = { ...process.env, NODE_ENV: "production" };

  await runCliKintone(
    [
      "plugin",
      "pack",
      "--input",
      path.resolve(manifestJSONPath),
      "--private-key",
      path.resolve(privateKeyPath),
      "--output",
      outputPath,
    ],
    { env },
  );
};
