export let packageJson: Record<string, unknown>;

export const injectPackageJson = (param: typeof packageJson) => {
  packageJson = param;
  return packageJson;
};
