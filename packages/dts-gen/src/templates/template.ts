import * as fs from "fs";
import * as path from "path";
import * as prettier from "prettier";
// eslint-disable-next-line node/no-extraneous-import
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
  const eslintReport = await eslint.lintText(tsExpression.tsExpression());
  const eslintOutput = eslintReport
    .filter((r) => Object.prototype.hasOwnProperty.call(r, "output"))
    .map((r) => r.output)
    .join("");
  const prettySource = prettier.format(eslintOutput, {
    parser: "typescript",
  });
  const outputPath = path.join(process.cwd(), output);

  if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath));
  }

  fs.writeFileSync(path.join(process.cwd(), output), prettySource);
};
// definition
export const TypeDefinitionTemplate = {
  renderAsFile,
};
