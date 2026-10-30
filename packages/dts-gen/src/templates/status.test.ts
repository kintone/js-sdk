import fs from "fs";
import os from "os";
import path from "path";
import ts from "typescript";
import { FieldTypeConverter } from "../converters/fileldtype-converter";
import { convertToTsExpression } from "./converter";

const generateStatus = (code: string, enabled: boolean) =>
  convertToTsExpression({
    namespace: "kintone.types",
    typeName: "Fields",
    fieldTypeGroups: FieldTypeConverter.convertFieldTypesToFieldTypeGroups([
      { type: "STATUS", code, enabled },
    ]),
  }).tsExpression();

describe("process management status", () => {
  test.each(["Status", "ステータス"])(
    "generates the saved field with code %s",
    (code) => {
      const output = generateStatus(code, true);
      expect(output).toContain(`"${code}" : kintone.fieldTypes.Status;`);
      expect(output.indexOf(`"${code}"`)).toBeGreaterThan(
        output.indexOf("interface SavedFields"),
      );
    },
  );

  test("omits the status when process management is disabled", () => {
    expect(generateStatus("Status", false)).not.toContain('"Status"');
  });

  test.each(["Status", "ステータス"])(
    "the saved record for %s compiles with the packaged types",
    (code) => {
      const temp = fs.mkdtempSync(path.join(os.tmpdir(), "dts-gen-status-"));
      try {
        const filename = path.join(temp, "status.ts");
        fs.writeFileSync(
          filename,
          `${generateStatus(code, true)}
const record: kintone.types.SavedFields = {
  $id: { type: "__ID__", value: "1" },
  $revision: { type: "__REVISION__", value: "1" },
  ${JSON.stringify(code)}: { type: "STATUS", value: "In progress" },
};
const statusValue: string = record[${JSON.stringify(code)}].value;
void statusValue;
`,
        );
        const program = ts.createProgram(
          [path.resolve(__dirname, "../../kintone.d.ts"), filename],
          {
            noEmit: true,
            strict: true,
            target: ts.ScriptTarget.ES2020,
            types: [],
          },
        );
        const diagnostics = ts.getPreEmitDiagnostics(program);
        expect(
          diagnostics.map((d) =>
            ts.flattenDiagnosticMessageText(d.messageText, "\n"),
          ),
        ).toEqual([]);
      } finally {
        fs.rmSync(temp, { recursive: true, force: true });
      }
    },
  );
});
