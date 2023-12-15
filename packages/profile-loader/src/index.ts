import { loadConfig, loadCredentials } from "./config";
import { loadEnv } from "./env";
import { getProfile } from "./profile";

export type Profile = {
  username: string | null;
  password: string | null;
  baseUrl: string | null;
  apiToken: string | null;
  oAuthToken: string | null;
};

export const loadProfile = <T extends Profile>(params: {
  profile?: string;
  config?: string | false;
  credentials?: string | false;
}): T => {
  let {
    profile,
    config: configFilePath,
    credentials: credentialsFilePath,
  } = params;
  profile = getProfile(profile);
  const config = loadConfig<T>(profile, configFilePath);
  detectCredentialsValues(config);

  const credentials = loadCredentials<T>(profile, credentialsFilePath);

  return {
    username: null,
    password: null,
    baseUrl: null,
    apiToken: null,
    oAuthToken: null,
    ...config,
    ...credentials,
    ...loadEnv<T>(),
  } as T;
};

const detectCredentialsValues = (config: Partial<Profile>) => {
  const credentialsProps = new Set([
    "username",
    "password",
    "apiToken",
    "oAuthToken",
  ]);
  const warnedProps = Object.keys(config).filter((key) =>
    credentialsProps.has(key),
  );
  if (warnedProps.length > 0) {
    console.warn(`Do not include credentials values(${warnedProps.join(",")})`);
  }
};
