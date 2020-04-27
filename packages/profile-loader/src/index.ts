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

export const loadProfile = (
  profile = "default",
  configFilePath = getConfigFilePath()
): Profile => {
  return {
    username: null,
    password: null,
    baseUrl: null,
    apiToken: null,
    oAuthToken: null,
    ...loadConfig(profile, configFilePath),
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

const getConfigFilePath = (): string | null => {
  const filePath = path.resolve(process.cwd(), ".kintone", "config");
  if (fs.existsSync(filePath)) {
    return filePath;
  }
  return null;
};
