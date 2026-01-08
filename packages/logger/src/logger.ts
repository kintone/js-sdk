import type {
  Logger,
  LogConfigLevel,
  LogEvent,
  LogEventLevel,
  Printer,
} from "./types";

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
    this.print(formattedMessage);
  }

  private isPrintable(event: LogEvent): boolean {
    const logConfigLevelMatrix: {
      [configLevel in LogConfigLevel]: LogEventLevel[];
    } = {
      trace: ["trace", "debug", "info", "warn", "error", "fatal"],
      debug: ["debug", "info", "warn", "error", "fatal"],
      info: ["info", "warn", "error", "fatal"],
      warn: ["warn", "error", "fatal"],
      error: ["error", "fatal"],
      fatal: ["fatal"],
      none: [],
    };
    return logConfigLevelMatrix[this.logConfigLevel].includes(event.level);
  }

  private format(event: LogEvent): string {
    const timestamp = new Date().toISOString();
    const eventLevelLabels: { [level in LogEventLevel]: string } = {
      trace: "TRACE",
      debug: "DEBUG",
      info: "INFO",
      warn: "WARN",
      error: "ERROR",
      fatal: "FATAL",
    };
    const stringifiedMessage = stringifyMessage(event.message);
    const prefix = `[${timestamp}] ${eventLevelLabels[event.level]}:`;

    return stringifiedMessage
      .split("\n")
      .filter((line) => line.length > 0)
      .map((line) => `${prefix} ${line}`)
      .join("\n");
  }

  private print(message: string): void {
    this.printer(message);
  }
}

export const logger = new StandardLogger();

const stringifyMessage = (message: unknown): string => {
  if (message instanceof Error) {
    return message.toString();
  }
  return String(message);
};
