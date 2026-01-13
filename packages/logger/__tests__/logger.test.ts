import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { LogConfigLevel, LogEventLevel, Printer } from "../src/types";
import { StandardLogger } from "../src/logger";

describe("StandardLogger", () => {
  const mockDate = new Date(0);
  let dateSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    dateSpy = vi.spyOn(global, "Date").mockImplementation(() => mockDate);
  });

  afterEach(() => {
    dateSpy.mockRestore();
  });

  const patternTest: [string, LogEventLevel][] = [
    ["TRACE", "trace"],
    ["DEBUG", "debug"],
    ["INFO", "info"],
    ["WARN", "warn"],
    ["ERROR", "error"],
    ["FATAL", "fatal"],
  ];

  it.each(patternTest)(
    'should display %s message when calling logger with "%s" level',
    (logDisplay, logLevel) => {
      const message = "This is example message";
      const mockPrinter = vi.fn();

      const options: { logConfigLevel: LogConfigLevel; printer: Printer } = {
        logConfigLevel: logLevel,
        printer: mockPrinter,
      };
      const standardLogger = new StandardLogger(options);
      standardLogger[logLevel](message);

      const expectedMessage = new RegExp(
        `\\[${mockDate.toISOString()}] (.*)${logDisplay}(.*): ${message}`,
      );

      expect(mockPrinter).toHaveBeenCalledWith(
        expect.stringMatching(expectedMessage),
      );
    },
  );

  it("should not display any message when calling logger with 'none' level", () => {
    const message = "This is example message";
    const mockPrinter = vi.fn();

    const options: { logConfigLevel: LogConfigLevel; printer: Printer } = {
      logConfigLevel: "none",
      printer: mockPrinter,
    };
    const standardLogger = new StandardLogger(options);
    standardLogger.info(message);

    expect(mockPrinter).not.toHaveBeenCalled();
  });

  it("should display the correct log message with multiple lines message", () => {
    const firstLineMessage = "This is first line message";
    const secondLineMessage = "This is second line message";
    const mockPrinter = vi.fn();

    const options: { logConfigLevel: LogConfigLevel; printer: Printer } = {
      logConfigLevel: "info",
      printer: mockPrinter,
    };
    const standardLogger = new StandardLogger(options);
    standardLogger.info(`${firstLineMessage}\n${secondLineMessage}`);

    const expectedMessage = new RegExp(
      `\\[${mockDate.toISOString()}] (.*)INFO(.*): ${firstLineMessage}\n\\[${mockDate.toISOString()}] (.*)INFO(.*): ${secondLineMessage}`,
    );

    expect(mockPrinter).toHaveBeenCalledWith(
      expect.stringMatching(expectedMessage),
    );
  });

  it("should display the correct log message corresponding to the log config level", () => {
    const message = "This is example message";
    const mockPrinter = vi.fn();

    const options: { logConfigLevel?: LogConfigLevel; printer: Printer } = {
      printer: mockPrinter,
    };
    const standardLogger = new StandardLogger(options);
    standardLogger.setLogConfigLevel("warn");
    standardLogger.trace(message);
    standardLogger.debug(message);
    standardLogger.info(message);
    standardLogger.warn(message);
    standardLogger.error(message);
    standardLogger.fatal(message);

    expect(mockPrinter).toHaveBeenCalledTimes(3);
  });

  it("should format Error objects correctly", () => {
    const mockPrinter = vi.fn();
    const options: { logConfigLevel: LogConfigLevel; printer: Printer } = {
      logConfigLevel: "error",
      printer: mockPrinter,
    };
    const standardLogger = new StandardLogger(options);
    const error = new Error("Test error message");
    standardLogger.error(error);

    expect(mockPrinter).toHaveBeenCalledWith(
      expect.stringContaining("Error: Test error message"),
    );
  });
});
