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
      const workspaces = getTypeScriptWorkspaces();

      for (const { packageName, packagePath } of workspaces) {
        try {
          expect(referencePaths.includes(packagePath)).toBe(true);
        } catch (e) {
          console.error(
            `${packageName} must be included in the references field in packages/tsconfig.json`
          );
          throw e;
        }
      }
    });
    describe("packages/*/tsconfig", () => {
      it("should specify all internal dependencies in each Project References setting", async () => {
        const workspaces = getTypeScriptWorkspaces();
        for (const { packageName, packagePath, dependencies } of workspaces) {
          const referencePaths = getReferencePaths(packagePath);

          for (const dependency of dependencies) {
            if (isIgnorePackage(dependency)) {
              continue;
            }
            if (
              referencePaths.length === 0 ||
              !referencePaths.some((referencePath: string) => {
                return (
                  referencePath === getWorkspaceByName(dependency).packagePath
                );
              })
            ) {
              throw new Error(
                `${packageName} doesn't have ${dependency} in the references field in tsconfig.json`
              );
            }
          }
        }
      });
    });
  });
});
