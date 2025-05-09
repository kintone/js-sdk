import assert from "assert";
import {
  getTypeScriptWorkspaces,
  getWorkspaceByName,
  getReferencePaths,
  isIgnorePackage,
} from "./lib/workspace";

describe("projectReferences", () => {
  describe("packages/tsconfig", () => {
    it("should includes all packages and examples", () => {
      const referencePaths = getReferencePaths("packages");
      const workspaces = getTypeScriptWorkspaces().filter(({ packagePath }) =>
        /\/packages\//.test(packagePath),
      );

      const ignorePackageList: string[] = ["@kintone/rest"];

      for (const { packageName, packagePath } of workspaces) {
        if (ignorePackageList.includes(packageName)) {
          continue;
        }

        assert.ok(
          referencePaths.includes(packagePath),
          `${packageName} must be included in the references field in packages/tsconfig.json`,
        );
      }
    });
    describe("packages/*/tsconfig", () => {
      it("should specify all internal dependencies in each Project References setting", async () => {
        const workspaces = getTypeScriptWorkspaces().filter(({ packagePath }) =>
          /\/packages\//.test(packagePath),
        );
        for (const { packageName, packagePath, dependencies } of workspaces) {
          const referencePaths = getReferencePaths(packagePath);
          for (const dependency of dependencies) {
            if (isIgnorePackage(dependency)) {
              continue;
            }
            assert.ok(
              referencePaths.some(
                (referencePath: string) =>
                  referencePath === getWorkspaceByName(dependency).packagePath,
              ),
              `${packageName} doesn't have ${dependency} in the references field in tsconfig.json`,
            );
          }
        }
      });
    });
  });
});
