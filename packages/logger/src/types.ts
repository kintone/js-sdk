export interface Logger {
  trace: (message: unknown) => void;
  debug: (message: unknown) => void;
  info: (message: unknown) => void;
  warn: (message: unknown) => void;
  error: (message: unknown) => void;
  fatal: (message: unknown) => void;
}

export const LOG_CONFIG_LEVELS = [
  "trace",
  "debug",
  "info",
  "warn",
  "error",
  "fatal",
  "none",
] as const;

export type LogConfigLevel = (typeof LOG_CONFIG_LEVELS)[number];

export type LogEventLevel = Exclude<LogConfigLevel, "none">;

export type LogEvent = {
  level: LogEventLevel;
  message: unknown;
};

export type Printer = (data: unknown) => void;
