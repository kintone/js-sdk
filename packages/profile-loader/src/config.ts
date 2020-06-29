import fs from "fs";
import path from "path";
import os from "os";
import toml from "toml";
import { Profile } from "./index";

const KINTONE_CONFIG_DIR = path.resolve(os.homedir(), ".kintone");
const CONFIG_FILE_NAME = "config";
const CREDENTIAL_FILE_NAME = "credential";

export const loadConfig = <T extends Profile>(
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

export const getDefaultConfigFilePath = (): string | null => {
  const kintoneConfigFile = process.env.KINTONE_CONFIG_PATH;
  if (kintoneConfigFile) {
    if (!fs.existsSync(kintoneConfigFile)) {
      throw new Error(`${kintoneConfigFile} cannot be found`);
    }
    return path.resolve(kintoneConfigFile, CONFIG_FILE_NAME);
  }
  const filePath = path.resolve(KINTONE_CONFIG_DIR, CONFIG_FILE_NAME);
  return fs.existsSync(filePath) ? filePath : null;
};

export const getDefaultCredentialFilePath = (): string | null => {
  const kintoneCredentialFile = process.env.KINTONE_CREDENTIAL_PATH;
  if (kintoneCredentialFile) {
    if (!fs.existsSync(kintoneCredentialFile)) {
      throw new Error(`${kintoneCredentialFile} cannot be found`);
    }
    return path.resolve(kintoneCredentialFile, CREDENTIAL_FILE_NAME);
  }
  const filePath = path.resolve(KINTONE_CONFIG_DIR, CREDENTIAL_FILE_NAME);
  return fs.existsSync(filePath) ? filePath : null;
};
