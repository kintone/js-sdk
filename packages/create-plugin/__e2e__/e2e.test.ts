import { execCommand, getCommands } from "./utils/helper";
import fs from "fs";
import path from "path";
import os from "os";

describe("create-plugin", function () {
  it("Should able create plugin with specified output directory and required options successfully", async () => {
    const commands = getCommands();
    const command = "create-plugin";
    if (!commands[command]) {
      throw new Error(`Command ${command} not found.`);
    }

    const workingDir = fs.mkdtempSync(
      path.join(os.tmpdir(), `create-plugin-e2e-test-${new Date().valueOf()}-`),
    );
    console.log(`Working directory: ${workingDir}`);

    const args = "my-plugin";
    const argsStr = `${commands[command]} ${workingDir}/${args}`;
    const cliProcess = execCommand("node", argsStr, {
      cwd: workingDir,
    });

    // Track the current step
    let currentStep = 0;

    // Promise to wait for CLI tool to exit
    const cliExitPromise = new Promise<void>((resolve, reject) => {
      // Listen for exit event of CLI tool
      cliProcess.on("exit", resolve);
      // Listen for error event of CLI tool
      cliProcess.on("error", reject);
    });

    const questions = [
      "Input your plug-in name in English [1-64chars]",
      "Input your plug-in description in English [1-200chars]",
      "Does your plug-in support Japanese?",
      "Does your plug-in support Chinese?",
      "Input your home page url for English (Optional)",
      "Does your plug-in support mobile views?",
      "Would you like to use @kintone/plugin-uploader?",
    ];

    const DEFAULT_VALUE = "\n";

    const answers = [
      DEFAULT_VALUE,
      DEFAULT_VALUE,
      DEFAULT_VALUE,
      DEFAULT_VALUE,
      DEFAULT_VALUE,
      DEFAULT_VALUE,
      "Yes",
    ];

    // Listen for output from the CLI tool
    cliProcess.stdout.on("data", async (data) => {
      const output = data.toString();
      console.log(output.trim());
      if (output.includes(questions[currentStep])) {
        cliProcess.stdin.write(answers[currentStep]);

        currentStep++;
      }

      if (currentStep === questions.length) {
        cliProcess.stdin.end();
      }
    });

    // Await for CLI tool to exit
    await cliExitPromise;
  });
});
