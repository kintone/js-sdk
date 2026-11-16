import assert from "assert";
import { execFileSync } from "child_process";
import { createRequire } from "module";
import path from "path";
import { pathToFileURL } from "url";

const packageDir = path.resolve(__dirname, "../..");
const requireFromPackage = createRequire(path.join(packageDir, "package.json"));

describe("package entry", () => {
  it("returns the validator function from require()", () => {
    const validator = requireFromPackage(packageDir);
    assert.strictEqual(typeof validator, "function");
  });

  it("keeps the validator function on require().default", () => {
    const validator = requireFromPackage(packageDir);
    assert.strictEqual(validator.default, validator);
  });

  it("returns the validator function from a default import in Node.js ESM", () => {
    const entryUrl = pathToFileURL(path.join(packageDir, "index.js")).href;
    const output = execFileSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `import validator from ${JSON.stringify(entryUrl)}; console.log(typeof validator);`,
      ],
      { encoding: "utf8" },
    );
    assert.strictEqual(output.trim(), "function");
  });
});
