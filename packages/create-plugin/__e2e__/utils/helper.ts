import fs from "fs";
import path from "path";
import os from "os";

export const generateRandomString = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export const generateWorkingDir = (): string => {
  return fs.mkdtempSync(
    path.join(os.tmpdir(), `create-plugin-e2e-test-${new Date().valueOf()}-`),
  );
};
