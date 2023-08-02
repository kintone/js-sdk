import type { Profile } from ".";

export const loadEnv = <T extends Profile>(): Partial<T> => {
  const config: any = {
    username: process.env.KINTONE_USERNAME,
    password: process.env.KINTONE_PASSWORD,
    baseUrl: process.env.KINTONE_BASE_URL,
    apiToken: process.env.KINTONE_API_TOKEN,
    oAuthToken: process.env.KINTONE_OAUTH_TOKEN,
  } as const;
  return Object.keys(config).reduce(
    (acc, key) =>
      config[key] !== undefined ? { ...acc, [key]: config[key] } : acc,
    {},
  );
};
