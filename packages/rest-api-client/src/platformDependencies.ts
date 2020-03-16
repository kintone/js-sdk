export const platformDependencies = {
  readFileFromPath: (
    filePath: string
  ): Promise<{ name: string; data: unknown }> => {
    throw new Error("not implemented");
  }
};

export const injectPlatformDependencies = (deps: {
  readFileFromPath: (
    filePath: string
  ) => Promise<{ name: string; data: unknown }>;
}) => {
  platformDependencies.readFileFromPath = deps.readFileFromPath;
};
