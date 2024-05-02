import { spawn } from "child_process";
import fs from "fs";
import path from "path";

export type Response = {
  status?: number;
  stdout?: Buffer;
  stderr?: Buffer;
  error?: Error;
};

export type QuestionInput = {
  question: string;
  answer: string;
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

const parseArgs = (args: string, envVars?: { [key: string]: string }) => {
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

export const executeCommandWithInteractiveInput = async (options: {
  command: string;
  workingDir: string;
  outputDir: string;
  questionsInput: QuestionInput[];
  commandArguments?: string;
}) => {
  const { command, workingDir, outputDir, questionsInput, commandArguments } =
    options;
  const commands = getCommands();
  if (!commands[command]) {
    throw new Error(`Command ${command} not found.`);
  }

  const commandString = `${commands[command]} ${commandArguments || ""} ${outputDir}`;
  const cliProcess = execCommand("node", commandString, {
    cwd: workingDir,
  });

  let stdout: Buffer;
  let stderr: Buffer;

  const cliExitPromise = new Promise<Response>((resolve, reject) => {
    cliProcess.on("exit", (code: number) => {
      resolve({
        status: code,
        stdout: stdout ?? Buffer.from(""),
        stderr: stderr ?? Buffer.from(""),
      });
    });
    cliProcess.on("error", (error) => {
      reject({
        error,
      });
    });
  });

  let currentStep = 0;
  cliProcess.stdout.on("data", async (data: Buffer) => {
    const output = data.toString();
    if (currentStep === questionsInput.length || !questionsInput[currentStep]) {
      cliProcess.stdin.end();
      stdout = data;
      return;
    }

    if (output.includes(questionsInput[currentStep].question)) {
      cliProcess.stdin.write(questionsInput[currentStep].answer);
      cliProcess.stdin.write("\n");
      currentStep++;
    }
  });

  cliProcess.stderr.on("data", async (data: Buffer) => {
    stderr = data;
    cliProcess.stdin.end();
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
