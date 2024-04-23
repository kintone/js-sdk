import { spawn, spawnSync } from "child_process";
import fs from "fs";
import path from "path";

export type ReplacementValue = string | string[] | number | number[] | boolean;
export type Replacements = { [key: string]: ReplacementValue };

export const getCommands = (): { [key: string]: string } => {
  const packageJson = JSON.parse(
    fs.readFileSync(path.resolve("package.json"), "utf8"),
  );
  return Object.fromEntries(
    Object.entries(packageJson.bin).map(([command, relativePath]) => {
      return [command, path.resolve(relativePath as string)];
    }),
  );
};

export const execCommandSync = (
  command: string,
  args: string,
  options?: {
    env?: { [key: string]: string };
    cwd?: string;
  },
) => {
  const response = spawnSync(command, parseArgs(args, options?.env), {
    env: options?.env ?? {},
    cwd: options?.cwd ?? process.cwd(),
    shell: true,
  });
  if (response.error) {
    throw response.error;
  }
  return response;
};

export const execCommand = (
  command: string,
  args: string,
  options: {
    env?: { [key: string]: string };
    cwd?: string;
  },
) => {
  return spawn(command, parseArgs(args, options?.env), {
    stdio: ["pipe", "pipe", "pipe"],
    env: options?.env ?? process.env,
    cwd: options?.cwd ?? process.cwd(),
    shell: true,
  });
};

const parseArgs = (
  args: string,
  envVars: { [key: string]: string } | undefined,
) => {
  const replacedArgs = replaceTokenWithEnvVars(args, envVars).match(
    /(?:[^\s'"]+|"[^"]*"|'[^']*')+/g,
  );

  if (!replacedArgs) {
    throw new Error("Failed to parse command arguments.");
  }

  return replacedArgs.map((arg) => arg.replace(/^['"]|['"]$/g, ""));
};

const replaceTokenWithEnvVars = (
  input: string,
  envVars: { [key: string]: string } | undefined,
) =>
  input
    .replace(/\$\$[a-zA-Z0-9_]+/g, processEnvReplacer)
    .replace(/\$[a-zA-Z0-9_]+/g, inputEnvReplacer(envVars));

const processEnvReplacer = (substring: string) => {
  const key = substring.replace("$$", "");
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`The env variable in process.env is missing: ${key}`);
  }
  return value;
};

const inputEnvReplacer = (envVars: { [key: string]: string } | undefined) => {
  return (substring: string) => {
    if (!envVars) {
      return substring;
    }

    const key = substring.replace("$", "");
    const value = envVars[key];
    if (value === undefined) {
      throw new Error(`The env variable in input parameter is missing: ${key}`);
    }
    return value;
  };
};

export const compareBuffers = (buffer1: Buffer, buffer2: Buffer): boolean => {
  if (buffer1.length !== buffer2.length) {
    return false;
  }

  for (let i = 0; i < buffer1.length; i++) {
    if (buffer1[i] !== buffer2[i]) {
      return false;
    }
  }

  return true;
};
