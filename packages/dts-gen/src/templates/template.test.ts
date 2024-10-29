import { DemoClient } from "../kintone/clients/demo-client";
import { DemoFullWidthSymbolClient } from "../kintone/clients/demo-fullwidth-symbol-client";
import { FieldTypeConverter } from "../converters/fileldtype-converter";
import { objectValues } from "../utils/objectvalues";
import * as fs from "fs";
import { ESLint } from "eslint";
import path from "path";
import tsPreset from "@cybozu/eslint-config/flat/presets/typescript";
import * as prettierPluginTypescript from "prettier/plugins/typescript";
import * as prettierPluginEstree from "prettier/plugins/estree";
import { format } from "prettier/standalone";
import { convertToTsExpression } from "./converter";

const writeAndLint = async (filepath: string, expression: string) => {
  await fs.promises.mkdir(path.dirname(filepath), { recursive: true });
  // It fails when linting a string, so it is saved to a file first.
  await fs.promises.writeFile(filepath, expression);
  const eslint = new ESLint({
    cwd: path.resolve(__dirname, "..", ".."),
    fix: true,
    baseConfig: tsPreset,
    overrideConfig: {
      rules: {
        "@typescript-eslint/no-namespace": [
          "error",
          { allowDeclarations: true },
        ],
      },
    },
  });
  const eslintResult = (await eslint.lintFiles(filepath))[0];
  const eslintOutput = eslintResult.output;
  const prettySource = await format(eslintOutput, {
    parser: "typescript",
    plugins: [prettierPluginTypescript, prettierPluginEstree],
  });

  await fs.promises.mkdir(path.dirname(filepath), { recursive: true });
  await fs.promises.writeFile(filepath, prettySource);
};

describe("convertToTsExpression", () => {
  const TEMP_TEST_TYPEDEF = "tmp.test-convertToTsExpression-fields.d.ts";
  test("generate type definition file", async () => {
    const client = new DemoClient();
    const fieldTypeGroups = await client
      .fetchFormProperties({
        appId: "",
        preview: false,
        guestSpaceId: null,
      })
      .then((properties) =>
        FieldTypeConverter.convertFieldTypesToFieldTypeGroups(
          objectValues(properties),
        ),
      );
    const input = {
      typeName: "TestFields",
      namespace: "kintone.types",
      fieldTypeGroups,
    };
    const tsExpression = convertToTsExpression(input).tsExpression();
    await writeAndLint(TEMP_TEST_TYPEDEF, tsExpression);

    const expected = fs
      .readFileSync(`./resources/test-renderAsFile-fields.d.ts`)
      .toString()
      .trim()
      .replace(/\r?\n/g, "");

    const actual = fs
      .readFileSync(TEMP_TEST_TYPEDEF)
      .toString()
      .trim()
      .replace(/\r?\n/g, "");

    expect(actual.toString().trim()).toEqual(expected.toString().trim());
  });

  afterEach(() => {
    fs.unlink(TEMP_TEST_TYPEDEF, (err) => {
      if (err) {
        throw err;
      }
    });
  });
});

describe("fullWidthSymbol Test", () => {
  const TEMP_TEST_TYPEDEF = "tmp.test-fullWidthSymbol-fields.d.ts";
  test("generate type definition file", async () => {
    const client = new DemoFullWidthSymbolClient();
    const fieldTypeGroups = await client
      .fetchFormProperties({
        appId: "",
        preview: false,
        guestSpaceId: null,
      })
      .then((properties) =>
        FieldTypeConverter.convertFieldTypesToFieldTypeGroups(
          objectValues(properties),
        ),
      );
    const input = {
      typeName: "TestFields",
      namespace: "kintone.types",
      fieldTypeGroups,
    };
    const tsExpression = convertToTsExpression(input).tsExpression();
    await writeAndLint(TEMP_TEST_TYPEDEF, tsExpression);

    const expected = fs
      .readFileSync("./resources/test-fullWidthSymbol-fields.d.ts")
      .toString()
      .trim()
      .replace(/\r?\n/g, "");

    const actual = fs
      .readFileSync(TEMP_TEST_TYPEDEF)
      .toString()
      .trim()
      .replace(/\r?\n/g, "");

    expect(actual.toString().trim()).toEqual(expected.toString().trim());
  });

  afterEach(() => {
    fs.unlink(TEMP_TEST_TYPEDEF, (err) => {
      if (err) {
        throw err;
      }
    });
  });
});
