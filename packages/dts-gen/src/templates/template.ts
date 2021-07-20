import * as fs from "fs";
import * as path from "path";
import * as prettier from "prettier";

import { FieldTypeGroups } from "../converters/fileldtype-converter";
import { convertToTsExpression } from "./converter";

interface RenderInput {
  typeName: string;
  namespace: string;
  fieldTypeGroups: FieldTypeGroups;
}

function renderAsFile(output: string, renderInput: RenderInput) {
  const tsExpression = convertToTsExpression(renderInput);
  const prettySource = prettier.format(tsExpression.tsExpression(), {
    parser: "typescript",
  });
  const outputPath = path.join(process.cwd(), output);

  if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath));
  }

  fs.writeFileSync(path.join(process.cwd(), output), prettySource);
}
// definition
export const TypeDefinitionTemplate = {
  renderAsFile,
};
