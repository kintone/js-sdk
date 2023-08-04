import { spawnSync } from "child_process";
import path from "path";
import fs from "fs";

// eslint-disable-next-line node/no-unpublished-import
import commentJSON from "comment-json";

const IGNORE_PACKAGES: string[] = [];

let __cacheWorkspacesInfo: PnpmWorkSpaceInfo;

type PnpmWorkSpaceInfo = {
  [packageName: string]: {
    location: string;
    dependencies: string[];
  };
};

export const getPnpmWorkspacesInfo = (): PnpmWorkSpaceInfo => {
  if (__cacheWorkspacesInfo) {
    return __cacheWorkspacesInfo;
  }

  const spawnOutput = spawnSync(
    "pnpm",
    ["m", "ls", "--prod", "--depth 0", "--json", "--only-project"],
    {
      shell: true,
    }
  ).stdout.toString();

  const parseSpawnOutput = JSON.parse(spawnOutput);

  const workspaceInfoArray = parseSpawnOutput.map(
    (packageItem: PnpmWorkSpaceInfo) => {
      return [
        packageItem.name,
        {
          location: packageItem.path,
          dependencies: packageItem.dependencies
            ? Object.keys(packageItem.dependencies)
            : [],
        },
      ];
    }
  );

  // eslint-disable-next-line node/no-unsupported-features/es-builtins
  const workspaceInfo = Object.fromEntries(workspaceInfoArray);
  __cacheWorkspacesInfo = workspaceInfo;

  return workspaceInfo;
};

type WorkspaceInfo = {
  packageName: string;
  packagePath: string;
  dependencies: string[];
};

export const getWorkspaces = (): WorkspaceInfo[] => {
  const workspaceInfo = getPnpmWorkspacesInfo();

  return Object.entries<PnpmWorkSpaceInfo[string]>(workspaceInfo).map(
    ([packageName, { location, dependencies }]) => ({
      packageName,
      packagePath: path.resolve(location),
      dependencies,
    })
  );
};

export const getTypeScriptWorkspaces = (): WorkspaceInfo[] => {
  return getWorkspaces().filter(
    ({ packageName }) => !IGNORE_PACKAGES.includes(packageName)
  );
};

export const getWorkspaceByName = (packageName: string): WorkspaceInfo => {
  const workspaces = getWorkspaces();
  return workspaces.find((workspace) => workspace.packageName === packageName)!;
};

type TSConfig = {
  references: Array<{ path: string }>;
};

const isTSConfig = (value: unknown): value is TSConfig => {
  if (value == null) {
    return false;
  }
  if (typeof value !== "object") {
    return false;
  }
  if (!("references" in value)) {
    return false;
  }
  const references = (value as { references: unknown }).references;
  if (!Array.isArray(references)) {
    return false;
  }
  return references.every((reference) => typeof reference.path === "string");
};

export const getReferencePaths = (packagePath: string): string[] => {
  const tsconfig = commentJSON.parse(
    fs.readFileSync(path.resolve(packagePath, "tsconfig.json")).toString()
  );

  if (isTSConfig(tsconfig)) {
    return tsconfig.references.map((reference) =>
      path.resolve(packagePath, reference.path)
    );
  }

  return [];
};

export const isIgnorePackage = (packageName: string): boolean =>
  IGNORE_PACKAGES.includes(packageName);
