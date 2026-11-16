import assert from "assert";
import path from "path";
import ts from "typescript";

const packageName = "@kintone/plugin-manifest-validator";
const packageDir = path.resolve(__dirname, "../..");
const fixtureDir = path.join(packageDir, "__type-fixtures__");
const installedPackageDir = path.join(fixtureDir, "node_modules", packageName);

const toPackagePath = (fileName: string) =>
  fileName.startsWith(installedPackageDir)
    ? path.join(packageDir, path.relative(installedPackageDir, fileName))
    : fileName;

/**
 * Type-checks in-memory fixtures that import the package by name, resolving
 * the name to this package as if it were installed in node_modules.
 */
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
  const { fileExists, readFile, getSourceFile, directoryExists, realpath } =
    host;
  host.fileExists = (fileName) =>
    files.has(fileName) || fileExists.call(host, toPackagePath(fileName));
  host.readFile = (fileName) =>
    files.get(fileName) ?? readFile.call(host, toPackagePath(fileName));
  host.directoryExists = (directoryName) =>
    installedPackageDir.startsWith(directoryName) ||
    (directoryExists?.call(host, toPackagePath(directoryName)) ?? true);
  host.realpath = (fileName) =>
    realpath?.call(host, toPackagePath(fileName)) ?? toPackagePath(fileName);
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
  target: ts.ScriptTarget.ES2022,
  types: [],
};

const usage = (callDefault: boolean) => `
import validator from "${packageName}";
import type { RequiredProperties } from "${packageName}";

const requiredProperties: RequiredProperties = { items: [] };
export const result: boolean | PromiseLike<any> = validator({}).valid;
${callDefault ? "export const defaultResult = validator.default({});" : ""}
// @ts-expect-error the validator requires a manifest
validator();
// @ts-expect-error items must be strings or required object properties
const invalidProperties: RequiredProperties = { items: [1] };
export { requiredProperties, invalidProperties };
`;

describe("package types", () => {
  it("allows calling the default import in Node.js ESM and CommonJS", () => {
    const diagnostics = typeCheck(
      {
        "esm.mts": usage(true),
        "cjs.cts": usage(true),
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
      { "bundler.ts": usage(true) },
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
        { "commonjs.ts": usage(esModuleInterop) },
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
