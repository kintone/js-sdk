import type {
  Logger,
  LogConfigLevel,
  LogEvent,
  LogEventLevel,
  Printer,
} from "./types";
import { LOG_CONFIG_LEVELS } from "./types";

const LEVEL_ORDER = LOG_CONFIG_LEVELS.reduce(
  (acc, level, index) => {
    acc[level] = index;
    return acc;
  },
  {} as Record<LogConfigLevel, number>,
);

export class StandardLogger implements Logger {
  private readonly printer: Printer = console.error;
  private logConfigLevel: LogConfigLevel = "info";

  constructor(options?: {
    logConfigLevel?: LogConfigLevel;
    printer?: Printer;
  }) {
    if (options?.printer) {
      this.printer = options.printer;
    }
    if (options?.logConfigLevel) {
      this.logConfigLevel = options.logConfigLevel;
    }
  }

  trace(message: unknown): void {
    this.log({ level: "trace", message });
  }

  debug(message: unknown): void {
    this.log({ level: "debug", message });
  }

  info(message: unknown): void {
    this.log({ level: "info", message });
  }

  warn(message: unknown): void {
    this.log({ level: "warn", message });
  }

  error(message: unknown): void {
    this.log({ level: "error", message });
  }

  fatal(message: unknown): void {
    this.log({ level: "fatal", message });
  }

  setLogConfigLevel(logConfigLevel: LogConfigLevel): void {
    this.logConfigLevel = logConfigLevel;
  }

  private log(event: LogEvent): void {
    if (!this.isPrintable(event)) {
      return;
    }
    const formattedMessage = this.format(event);
    this.printer(formattedMessage);
  }

  private isPrintable(event: LogEvent): boolean {
    if (this.logConfigLevel === "none") {
      return false;
    }
    return LEVEL_ORDER[event.level] >= LEVEL_ORDER[this.logConfigLevel];
  }

  private format(event: LogEvent): string {
    const timestamp = new Date().toISOString();
    const stringifiedMessage = this.stringifyMessage(event.message);
    const prefix = `[${timestamp}] ${event.level.toUpperCase()}:`;

    return stringifiedMessage
      .split("\n")
      .filter((line) => line.length > 0)
      .map((line) => `${prefix} ${line}`)
      .join("\n");
  }

  private stringifyMessage(message: unknown): string {
    if (message instanceof Error) {
      return message.toString();
    }
    return String(message);
  }
}

export const logger = new StandardLogger();
