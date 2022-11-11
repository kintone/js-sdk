import fs from "fs";
import path from "path";
import os from "os";
import toml from "toml";
import type { Profile } from "./index";

const KINTONE_CONFIG_DIR = path.resolve(os.homedir(), ".kintone");
const CONFIG_FILE_NAME = "config";
const CREDENTIALS_FILE_NAME = "credentials";

const loadSettings = <T extends Profile>(
  profile: string,
  filePath: string | null
): Partial<T> => {
  if (!filePath) {
    return {};
  }
  const tomlString = fs.readFileSync(filePath).toString();
  const config = toml.parse(tomlString);
  return config[profile];
};

export const loadConfig = <T extends Profile>(
  profile: string,
  filePath: string | undefined | false
): Partial<T> => {
  if (filePath === false) {
    return {};
  }
  return loadSettings(profile, filePath ?? getDefaultConfigFilePath());
};

export const loadCredentials = <T extends Profile>(
  profile: string,
  filePath: string | undefined | false
): Partial<T> => {
  if (filePath === false) {
    return {};
  }
  return loadSettings(profile, filePath ?? getDefaultCredentialsFilePath());
};

const getDefaultConfigFilePath = (): string | null => {
  const kintoneConfigFile = process.env.KINTONE_CONFIG_FILE;
  if (kintoneConfigFile) {
    if (!fs.existsSync(kintoneConfigFile)) {
      throw new Error(`${kintoneConfigFile} cannot be found`);
    }
    return kintoneConfigFile;
  }
  const filePath = path.resolve(KINTONE_CONFIG_DIR, CONFIG_FILE_NAME);
  return fs.existsSync(filePath) ? filePath : null;
};

const getDefaultCredentialsFilePath = (): string | null => {
  const kintoneCredentialsFile = process.env.KINTONE_CREDENTIALS_FILE;
  if (kintoneCredentialsFile) {
    if (!fs.existsSync(kintoneCredentialsFile)) {
      throw new Error(`${kintoneCredentialsFile} cannot be found`);
    }
    return kintoneCredentialsFile;
  }
  const filePath = path.resolve(KINTONE_CONFIG_DIR, CREDENTIALS_FILE_NAME);
  return fs.existsSync(filePath) ? filePath : null;
};
