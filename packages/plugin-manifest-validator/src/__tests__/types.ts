import assert from "assert";
import path from "path";
import ts from "typescript";

const packageDir = path.resolve(__dirname, "../..");
const fixtureDir = path.join(packageDir, "__type-fixtures__");

const typeCheck = (
  fixtures: Record<string, string>,
  options: ts.CompilerOptions,
): string[] => {
  const files = new Map(
    Object.entries(fixtures).map(([name, text]) => [
      path.join(fixtureDir, name),
      text,
    ]),
  );
  const host = ts.createCompilerHost(options);
  const { fileExists, readFile, getSourceFile } = host;
  host.fileExists = (fileName) =>
    files.has(fileName) || fileExists.call(host, fileName);
  host.readFile = (fileName) =>
    files.get(fileName) ?? readFile.call(host, fileName);
  host.getSourceFile = (fileName, languageVersion, ...rest) => {
    const text = files.get(fileName);
    return text === undefined
      ? getSourceFile.call(host, fileName, languageVersion, ...rest)
      : ts.createSourceFile(fileName, text, languageVersion);
  };
  const program = ts.createProgram([...files.keys()], options, host);
  return ts
    .getPreEmitDiagnostics(program)
    .map((diagnostic) =>
      ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
    );
};

const commonOptions: ts.CompilerOptions = {
  strict: true,
  noEmit: true,
  skipLibCheck: true,
  types: [],
};

const usage = (specifier: string, callDefault: boolean) => `
import validator from "${specifier}";
import type { RequiredProperties } from "${specifier}";

const requiredProperties: RequiredProperties = { items: [] };
export const result: boolean | PromiseLike<any> = validator({}).valid;
${callDefault ? "export const defaultResult = validator.default({});" : ""}
export { requiredProperties };
`;

describe("package types", () => {
  it("allows calling the default import in Node.js ESM and CommonJS", () => {
    const diagnostics = typeCheck(
      {
        "esm.mts": usage("../index.js", true),
        "cjs.cts": usage("../index.js", true),
      },
      {
        ...commonOptions,
        module: ts.ModuleKind.NodeNext,
        moduleResolution: ts.ModuleResolutionKind.NodeNext,
      },
    );
    assert.deepStrictEqual(diagnostics, []);
  });

  it("allows calling the default import with a bundler", () => {
    const diagnostics = typeCheck(
      { "bundler.ts": usage("..", true) },
      {
        ...commonOptions,
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
      },
    );
    assert.deepStrictEqual(diagnostics, []);
  });

  it.each([true, false])(
    "allows calling the default import in CommonJS output (esModuleInterop: %s)",
    (esModuleInterop) => {
      const diagnostics = typeCheck(
        { "commonjs.ts": usage("..", esModuleInterop) },
        {
          ...commonOptions,
          module: ts.ModuleKind.CommonJS,
          moduleResolution: ts.ModuleResolutionKind.Node10,
          esModuleInterop,
        },
      );
      assert.deepStrictEqual(diagnostics, []);
    },
  );
});
