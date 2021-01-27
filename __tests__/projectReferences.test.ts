import path from "path";
import { getWorkspacesInfo } from "./helper";

const tsconfig = require(path.resolve(
  __dirname,
  "..",
  "packages",
  "tsconfig.json"
));

const IGNORE_PACKAGES = ["./packages/plugin-packer"];

describe("packages/tsconfig", () => {
  it("should includes all packages and examples", () => {
    const referencePaths = tsconfig.references.map((ref: { path: string }) =>
      path.resolve("packages", ref.path)
    );
    const packageInfo = getWorkspacesInfo();
    const workspaces = Object.values<{ location: string }>(
      packageInfo
    ).map(({ location }) => [location, path.resolve(location)]);

    for (const [name, packagesPath] of workspaces) {
      try {
        expect(
          referencePaths.includes(packagesPath) ||
            IGNORE_PACKAGES.some(
              (ignorePackagesPath) =>
                path.resolve(ignorePackagesPath) === packagesPath
            )
        ).toBe(true);
      } catch (e) {
        console.error(
          `${name} must be included in the references field in packages/tsconfig.json`
        );
        throw e;
      }
    }
  });
});
