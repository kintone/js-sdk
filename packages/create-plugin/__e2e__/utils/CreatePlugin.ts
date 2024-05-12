import type { ChildProcessByStdio } from "child_process";
import type { Readable, Writable } from "node:stream";
import fs from "fs";
import path from "path";
import { execCommand } from "./executeCommand";

export type QuestionInput = {
  question: string;
  answer: string;
};

type Response = {
  stdout: string;
  stderr: string;
  status?: number | null;
};

export class CreatePlugin {
  private readonly command: string;
  private readonly workingDir: string;
  private readonly outputDir: string;
  private readonly commandArguments: string;
  private readonly questionsInput: QuestionInput[];
  private _childProcess?: ChildProcessByStdio<Writable, Readable, Readable>;
  private currentStep: number;
  private _response?: Response;
  private _stdout: string;
  private _stderr: string;

  constructor(options: {
    command: string;
    workingDir: string;
    outputDir: string;
    questionsInput: QuestionInput[];
    commandArguments?: string;
  }) {
    this.command = options.command;
    this.workingDir = options.workingDir;
    this.outputDir = options.outputDir;
    this.questionsInput = options.questionsInput;
    this.commandArguments = options.commandArguments ?? "";
    this.currentStep = 0;
    this._stdout = "";
    this._stderr = "";
  }

  public get childProcess() {
    if (this._childProcess === undefined) {
      throw new Error(
        "No child process found. Please call 'executeCommand' first.",
      );
    }
    return this._childProcess;
  }

  public set childProcess(value) {
    this._childProcess = value;
  }

  public get response() {
    if (this._response === undefined) {
      throw new Error("No response found. Please call 'executeCommand' first.");
    }
    return this._response;
  }

  public set response(value) {
    this._response = value;
  }

  async executeCommand(): Promise<Response> {
    const commands = this._getCommands();
    if (!commands[this.command]) {
      throw new Error(`Command ${this.command} not found.`);
    }

    const commandString = `${commands[this.command]} ${this.commandArguments || ""} "${this.outputDir}"`;
    this.childProcess = execCommand("node", commandString, {
      cwd: this.workingDir,
    });

    const cliExitPromise = new Promise<Response>((resolve, reject) => {
      this.childProcess.on("exit", (code: number) => {
        this.response = {
          status: code,
          stdout: this._stdout ? this._stdout.toString() : "",
          stderr: this._stderr ? this._stderr.toString() : "",
        };
        resolve(this.response);
      });
      this.childProcess.on("error", (error) => {
        reject({
          error,
        });
      });
    });

    this.childProcess.stdout.on("data", (data: Buffer) => {
      this._stdout = this._stdout.concat(data.toString());
      if (process.env.VERBOSE && ["true", "1"].includes(process.env.VERBOSE)) {
        console.log(this._stdout);
      }
    });

    this.childProcess.stderr.on("data", (data: Buffer) => {
      this._stderr = this._stderr.concat(data.toString());
      this.done();
    });

    while (this.currentStep < this.questionsInput.length) {
      this.childProcess.stdin.write(
        `${this.questionsInput[this.currentStep].answer}\n`,
      );
      this.currentStep++;

      if (this.currentStep < this.questionsInput.length) {
        await this.waitUntilStdioIncludes(
          `${this.questionsInput[this.currentStep].question}`,
        );
      } else {
        this.done();
      }
    }

    return cliExitPromise;
  }

  done() {
    this.childProcess.stdin.end();
  }

  getResponse(): Response {
    return this.response;
  }

  private _getCommands = (): { [key: string]: string } => {
    const packageJson = JSON.parse(
      fs.readFileSync(path.resolve("package.json"), "utf8"),
    );
    return Object.fromEntries(
      Object.entries(packageJson.bin).map(([command, relativePath]) => {
        return [command, path.resolve(relativePath as string)];
      }),
    );
  };

  private waitUntilStdioIncludes(
    message: string,
    options: { timeout: number; interval: number } = {
      timeout: 10000,
      interval: 500,
    },
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const { timeout, interval } = options;
      let timer: NodeJS.Timeout;
      const timeoutTimer = setTimeout(() => {
        clearInterval(timer);
        this.done();
        reject(
          new Error(
            `Timeout (${timeout}ms) exceeded when waiting for stdout: ${message}`,
          ),
        );
      }, timeout);

      const regex = new RegExp(this.escape(message));
      timer = setInterval(() => {
        if (regex.test(this._stdout) || this._isProcessExited()) {
          clearInterval(timer);
          clearTimeout(timeoutTimer);
          resolve();
        }
      }, interval);
    });
  }

  private escape(question: string): string {
    return question.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  private _isProcessExited() {
    return this.childProcess.exitCode !== null;
  }
}
