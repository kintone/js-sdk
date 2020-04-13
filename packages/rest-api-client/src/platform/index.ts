type PlatformDeps = {
  readFileFromPath: (
    filePath: string
  ) => Promise<{ name: string; data: unknown }>;
  buildPlatformDependentConfig: (params: object) => object;
};

export const platformDeps: PlatformDeps = {
  readFileFromPath: () => {
    throw new Error("not implemented");
  },
  buildPlatformDependentConfig: () => {
    throw new Error("not implemented");
  },
};

export const injectPlatformDeps = (deps: Partial<PlatformDeps>) => {
  platformDeps.readFileFromPath = deps.readFileFromPath!;
  platformDeps.buildPlatformDependentConfig = deps.buildPlatformDependentConfig!;
};
