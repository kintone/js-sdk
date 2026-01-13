import { logger } from "@kintone/logger";

export const printLog = (...texts: string[]) => {
  texts.forEach((t) => logger.info(t));
};

export const printError = (...errors: string[]) => {
  errors.forEach((e) => logger.error(e));
};
