import toml from "toml";
import fs from "fs";
import path from "path";

type Profile = {
  username: string | null;
  password: string | null;
  baseUrl: string | null;
  apiToken: string | null;
  oAuthToken: string | null;
};

export const loadProfile = (configFilePath = getConfigFilePath()): Profile => {
  return {
    username: null,
    password: null,
    baseUrl: null,
    apiToken: null,
    oAuthToken: null,
    ...loadEnvironmentVariable(),
    ...loadConfig(configFilePath),
  };
};

const loadEnvironmentVariable = (): Partial<Profile> => ({
  username: process.env.KINTONE_USERNAME || null,
  password: process.env.KINTONE_PASSWORD || null,
  baseUrl: process.env.KINTONE_BASE_URL || null,
  apiToken: process.env.KINTONE_API_TOKEN || null,
  oAuthToken: process.env.KINTONE_OAUTH_TOKEN || null,
});

const loadConfig = (filePath: string | null): Partial<Profile> => {
  if (!filePath) {
    return {};
  }
  const tomlString = fs.readFileSync(filePath).toString();
  return toml.parse(tomlString);
};

const getConfigFilePath = (): string | null => {
  const filePath = path.resolve(process.cwd(), ".kintone", "config");
  if (fs.existsSync(filePath)) {
    return filePath;
  }
  return null;
};
