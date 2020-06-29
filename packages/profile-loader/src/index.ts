import toml from "toml";
import {
  getDefaultConfigFilePath,
  getDefaultCredentialFilePath,
  loadConfig,
} from "./config";
import { loadEnv } from "./env";

export type Profile = {
  username: string | null;
  password: string | null;
  baseUrl: string | null;
  apiToken: string | null;
  oAuthToken: string | null;
};

export const loadProfile = <T extends Profile>(
  profile = "default",
  configFilePath = getDefaultConfigFilePath(),
  credentialFilePath = getDefaultCredentialFilePath()
): T => {
  const config = loadConfig<T>(profile, configFilePath);
  detectCredentialValues(config);

  return {
    username: null,
    password: null,
    baseUrl: null,
    apiToken: null,
    oAuthToken: null,
    ...config,
    ...loadConfig<T>(profile, credentialFilePath),
    ...loadEnv<T>(),
  } as T;
};

const detectCredentialValues = (config: Partial<Profile>) => {
  const credentialProps = new Set([
    "username",
    "password",
    "apiToken",
    "oAuthToken",
  ]);
  const warnedProps = Object.keys(config).filter((key) =>
    credentialProps.has(key)
  );
  if (warnedProps.length > 0) {
    console.warn(`Do not include credential values(${warnedProps.join(",")})`);
  }
};
