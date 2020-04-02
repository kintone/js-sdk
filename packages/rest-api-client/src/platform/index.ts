type PlatformDeps = {
  readFileFromPath: (
    filePath: string
  ) => Promise<{ name: string; data: unknown }>;
  createHttpsAgent: (pfx: Buffer, password: string) => any;
};

export const platformDeps: PlatformDeps = {
  readFileFromPath: () => {
    throw new Error("not implemented");
  },
  createHttpsAgent: () => {
    throw new Error("not implemented");
  },
};

export const injectPlatformDeps = (deps: Partial<PlatformDeps>) => {
  platformDeps.readFileFromPath = deps.readFileFromPath!;
  platformDeps.createHttpsAgent = deps.createHttpsAgent!;
};
