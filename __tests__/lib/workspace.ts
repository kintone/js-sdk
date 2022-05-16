import { spawnSync } from "child_process";
import path from "path";
import fs from "fs";

// eslint-disable-next-line node/no-unpublished-import
import commentJSON from "comment-json";

const IGNORE_PACKAGES: string[] = [];

let __cacheWorkspacesInfo: YarnWorkSpaceInfo;

type YarnWorkSpaceInfo = {
  [packageName: string]: {
    location: string;
    workspaceDependencies: string[];
  };
};

export const getYarnWorkspacesInfo = (): YarnWorkSpaceInfo => {
  if (__cacheWorkspacesInfo) {
    return __cacheWorkspacesInfo;
  }
  const workspaceInfo = JSON.parse(
    JSON.parse(
      spawnSync("yarn", ["workspaces", "--json", "info"], {
        shell: true,
      }).stdout.toString()
    ).data
  );
  __cacheWorkspacesInfo = workspaceInfo;
  return workspaceInfo;
};

type WorkspaceInfo = {
  packageName: string;
  packagePath: string;
  dependencies: string[];
};

export const getWorkspaces = (): WorkspaceInfo[] => {
  const workspaceInfo = getYarnWorkspacesInfo();
  return Object.entries<YarnWorkSpaceInfo[string]>(workspaceInfo).map(
    ([packageName, { location, workspaceDependencies }]) => ({
      packageName,
      packagePath: path.resolve(location),
      dependencies: workspaceDependencies,
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
