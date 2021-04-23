import childProcess from "child_process";
import { promisify } from "util";
import path from "path";

const projectRoot = path.resolve(__dirname, "../..");
const exec = promisify(childProcess.exec);
const packageJson = require(path.resolve(projectRoot, "package.json"));
const mainFilePath = path.resolve(
  projectRoot,
  packageJson.bin["kintone-data-loader"]
);

const checkRejectArg = ({
  arg,
  errorMessage,
}: {
  arg: string;
  errorMessage: string | RegExp;
}) => {
  return expect(
    exec(`cross-env LC_ALL='en_US' node ${mainFilePath} ${arg}`)
  ).rejects.toThrow(errorMessage);
};

describe("main", () => {
  it("should throw error when no commands are passed", () => {
    return checkRejectArg({
      arg: "",
      errorMessage: "Not enough non-option arguments: got 0, need at least 1",
    });
  });
  it("should throw error when an undefined command is passed", () => {
    return checkRejectArg({
      arg: "dummy",
      errorMessage: "Unknown argument: dummy",
    });
  });
  it("should throw error when an undefined argument is passed", () => {
    return checkRejectArg({
      arg:
        "import --base-url https://example.com --app 1 --file-path /your/file/path --dummy",
      errorMessage: "Unknown argument: dummy",
    });
  });
  it("should throw error when required arguments are missing", () => {
    return checkRejectArg({
      arg: "import",
      errorMessage: /Missing required arguments:/,
    });
  });
});
