import toml from "toml";
import fs from "fs";
import path from "path";
import os from "os";

type Profile = {
  username: string | null;
  password: string | null;
  baseUrl: string | null;
  apiToken: string | null;
  oAuthToken: string | null;
};

const credentialProperties = new Set([
  "username",
  "password",
  "apiToken",
  "oAuthToken",
]);

export const loadProfile = (
  profile = "default",
  configFilePath = getDefaultConfigFilePath(),
  credentialFilePath = getDefaultCredentialFilePath()
): Profile => {
  const config = loadConfig(profile, configFilePath);
  const warningProperties = Object.keys(config).filter((key) =>
    credentialProperties.has(key)
  );
  if (warningProperties.length > 0) {
    console.warn(
      `Do not include credential values(${warningProperties.join(
        ","
      )}) in ${configFilePath}`
    );
  }
  return {
    username: null,
    password: null,
    baseUrl: null,
    apiToken: null,
    oAuthToken: null,
    ...loadConfig(profile, configFilePath),
    ...loadCredential(profile, credentialFilePath),
    ...loadEnvironmentVariable(),
  };
};

const loadEnvironmentVariable = (): Partial<Profile> => {
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
    {}
  );
};

const loadConfig = (
  profile: string,
  filePath: string | null
): Partial<Profile> => {
  if (!filePath) {
    return {};
  }
  const tomlString = fs.readFileSync(filePath).toString();
  const config = toml.parse(tomlString);
  return config[profile];
};

const loadCredential = (profile: string, filePath: string | null) => {
  if (!filePath) {
    return {};
  }
  const tomlString = fs.readFileSync(filePath).toString();
  const config = toml.parse(tomlString);
  return config[profile];
};

const getDefaultConfigFilePath = (): string | null => {
  const filePath = path.resolve(process.cwd(), ".kintone", "config");
  return fs.existsSync(filePath) ? filePath : null;
};

const getDefaultCredentialFilePath = (): string | null => {
  const filePath = path.resolve(os.homedir(), ".kintone", "credentials");
  return fs.existsSync(filePath) ? filePath : null;
};
