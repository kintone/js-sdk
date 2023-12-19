import * as fs from "fs";
import * as path from "path";
import { ESLint } from "eslint";
import { format } from "prettier/standalone";
import * as prettierPluginTypescript from "prettier/plugins/typescript";
import * as prettierPluginEstree from "prettier/plugins/estree";

import type { FieldTypeGroups } from "../converters/fileldtype-converter";
import { convertToTsExpression } from "./converter";

export interface RenderInput {
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
      extends: "@cybozu/eslint-config/presets/typescript",
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
  if (eslintResult.fatalErrorCount > 0) {
    let errorMessage = "";
    if (eslintResult.messages.length > 0) {
      errorMessage = `Causes:`;
      eslintResult.messages.forEach((error) => {
        errorMessage += `\n- ${error.message}`;
      });
    }
    throw new Error(
      `Failed to fix lint errors on the generated type definition file.\n${errorMessage}`,
    );
  }
  let eslintOutput = "";
  // https://eslint.org/docs/developer-guide/nodejs-api#-lintresult-type
  if ("output" in eslintResult) {
    eslintOutput = eslintResult.output;
  } else if ("source" in eslintResult) {
    eslintOutput = eslintResult.source;
  } else {
    throw new Error("unexpected result");
  }

  const prettySource = await format(eslintOutput, {
    parser: "typescript",
    plugins: [prettierPluginTypescript, prettierPluginEstree],
  });
  const outputPath = path.resolve(output);

  await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.promises.writeFile(outputPath, prettySource);
};
// definition
export const TypeDefinitionTemplate = {
  renderAsFile,
};
