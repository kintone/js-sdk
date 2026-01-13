# @kintone/logger

Logger utility for kintone CLI tools.

## Features

- **6 log levels**: trace, debug, info, warn, error, fatal
- **Configurable log level filtering**: Control which messages are printed
- **Timestamp support**: All messages include ISO 8601 timestamps
- **Custom printer support**: Use custom output functions instead of console.error
- **TypeScript support**: Full type definitions included

## Installation

```bash
npm install @kintone/logger
# or
pnpm add @kintone/logger
```

## Usage

### Basic Usage

```typescript
import { logger } from "@kintone/logger";

logger.info("Application started");
logger.warn("This is a warning");
logger.error(new Error("Something went wrong"));
```

### Custom Logger Instance

```typescript
import { StandardLogger } from "@kintone/logger";

const customLogger = new StandardLogger({
  logConfigLevel: "debug",
  printer: (message) => {
    // Custom output logic
    console.log(message);
  },
});

customLogger.debug("Debug message");
customLogger.info("Info message");
```

### Dynamic Log Level Configuration

```typescript
import { logger } from "@kintone/logger";

// Set log level to only show warnings and above
logger.setLogConfigLevel("warn");

logger.info("This won't be printed");
logger.warn("This will be printed");
logger.error("This will be printed");

// Disable all logging
logger.setLogConfigLevel("none");
```

## API Reference

### Logger Interface

```typescript
interface Logger {
  trace: (message: unknown) => void;
  debug: (message: unknown) => void;
  info: (message: unknown) => void;
  warn: (message: unknown) => void;
  error: (message: unknown) => void;
  fatal: (message: unknown) => void;
}
```

### StandardLogger Constructor Options

```typescript
new StandardLogger({
  logConfigLevel?: "trace" | "debug" | "info" | "warn" | "error" | "fatal" | "none";
  printer?: (data: unknown) => void;
});
```

### Log Levels

Log levels control which messages are printed based on severity:

- `trace`: Most verbose - prints all messages
- `debug`: Debug and above
- `info`: Info and above (default)
- `warn`: Warnings and above
- `error`: Errors and above
- `fatal`: Only fatal errors
- `none`: No output

## Output Format

All log messages are formatted with timestamp and level:

```
[2024-01-15T12:34:56.789Z] INFO: Application started
[2024-01-15T12:34:57.123Z] WARN: Low memory warning
[2024-01-15T12:34:58.456Z] ERROR: Failed to connect
```

## License

MIT

## Author

Cybozu, Inc.
