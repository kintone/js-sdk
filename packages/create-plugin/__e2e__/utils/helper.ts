import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { QUESTION_LIST } from "./constants";
import { getWorkingDir } from "./generateWorkingDir";

export type Response = {
  statusCode: number;
  error?: Error;
};

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

export const interactivePrompt = async (
  command: string,
  outputDir: string,
  answers: string[],
) => {
  const commands = getCommands();
  if (!commands[command]) {
    throw new Error(`Command ${command} not found.`);
  }

  const workingDir = getWorkingDir();
  const commandString = `${commands[command]} ${workingDir}/${outputDir}`;
  const cliProcess = execCommand("node", commandString, {
    cwd: workingDir,
  });

  const cliExitPromise = new Promise<Response>((resolve, reject) => {
    cliProcess.on("exit", (code: number) =>
      resolve({
        statusCode: code,
      }),
    );
    cliProcess.on("error", (error) =>
      resolve({
        statusCode: 1,
        error,
      }),
    );
  });

  let currentStep = 0;
  cliProcess.stdout.on("data", async (data) => {
    const output = data.toString();
    // console.log(output.trim());
    if (output.includes(QUESTION_LIST[currentStep])) {
      cliProcess.stdin.write(answers[currentStep]);
      currentStep++;
    }

    if (currentStep === QUESTION_LIST.length) {
      cliProcess.stdin.end();
    }
  });

  return cliExitPromise;
};

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
