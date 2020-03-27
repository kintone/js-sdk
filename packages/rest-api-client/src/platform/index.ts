type PlatformDeps = {
  readFileFromPath: (
    filePath: string
  ) => Promise<{ name: string; data: unknown }>;
};

export const platformDeps: PlatformDeps = {
  readFileFromPath: () => {
    throw new Error("not implemented");
  },
};

export const injectPlatformDeps = (deps: Partial<PlatformDeps>) => {
  Object.keys(deps).forEach((key) => {
    // we can assume that key is a key of PlatformDeps
    const name = key as keyof PlatformDeps;
    platformDeps[name] = deps[name]!;
  });
};
