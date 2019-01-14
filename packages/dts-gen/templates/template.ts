import * as nunjucks from "nunjucks";
import * as fs from "fs";
import * as path from "path";
import * as prettier from "prettier";

// eslint-disable-next-line no-used-vars
import { FieldTypeGroups } from "../converters/fileldtype-converter";

interface RenderInput {
  typeName: string;
  namespace: string;
  fields: FieldTypeGroups;
}

function renderAsFile(output: string, renderInput: RenderInput) {
  fs.readFile(path.join(__dirname, "/fields.d.ts.njk"), (err, data) => {
    if (err) {
      throw err;
    }

    nunjucks.configure({ autoescape: false });
    const namespace = renderInput.namespace;
    const typeName = renderInput.typeName;
    const savedTypeName = `Saved${typeName}`;
    const fqdnTypeName = `${namespace}.${typeName}`;
    const savedFqdnTypeName = `${namespace}.Saved${typeName}`;
    const fields = renderInput.fields;
    const source = nunjucks.renderString(data.toString(), {
      namespace,
      typeName,
      savedTypeName,
      fqdnTypeName,
      savedFqdnTypeName,
      ...fields
    });
    const formatOption = { parser: "typescript" };
    const prettySource = prettier.format(source, formatOption);

    fs.writeFile(path.join(__dirname, "/../", output), prettySource, err => {
      if (err) {
        throw err;
      }
    });
  });
}
// definition
export const TypeDefinitionTemplate = {
  renderAsFile
};
