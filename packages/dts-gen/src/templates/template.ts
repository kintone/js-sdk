import * as fs from "fs";
import * as path from "path";
import * as prettier from "prettier";
import { ESLint } from "eslint";

import { FieldTypeGroups } from "../converters/fileldtype-converter";
import { convertToTsExpression } from "./converter";

interface RenderInput {
  typeName: string;
  namespace: string;
  fieldTypeGroups: FieldTypeGroups;
}

const renderAsFile = async (output: string, renderInput: RenderInput) => {
  const tsExpression = convertToTsExpression(renderInput);
  const eslint = new ESLint({
    fix: true,
    useEslintrc: false,
    baseConfig: {
      extends: "@cybozu/eslint-config/presets/typescript-prettier",
      globals: {
        kintone: true,
      },
      rules: {
        "@typescript-eslint/no-namespace": [
          "error",
          { allowDeclarations: true },
        ],
      },
    },
  });
  const eslintResult = (await eslint.lintText(tsExpression.tsExpression()))[0];
  let eslintOutput = "";
  // https://eslint.org/docs/developer-guide/nodejs-api#-lintresult-type
  if ("output" in eslintResult) {
    eslintOutput = eslintResult.output;
  } else if ("source" in eslintResult) {
    eslintOutput = eslintResult.source;
  } else {
    throw new Error("unexpected result");
  }

  const prettySource = prettier.format(eslintOutput, {
    parser: "typescript",
  });
  const outputPath = path.join(process.cwd(), output);

  await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.promises.writeFile(path.join(process.cwd(), output), prettySource);
};
// definition
export const TypeDefinitionTemplate = {
  renderAsFile,
};
