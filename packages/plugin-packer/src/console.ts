import { logger } from "@kintone/logger";

const formatArgs = (...args: unknown[]): string =>
  args.map((arg) => String(arg)).join(" ");

export = {
  log: (...args: unknown[]) => logger.info(formatArgs(...args)),
  error: (...args: unknown[]) => logger.error(formatArgs(...args)),
  warn: (...args: unknown[]) => logger.warn(formatArgs(...args)),
};
