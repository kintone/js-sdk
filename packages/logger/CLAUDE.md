# CLAUDE.md - @kintone/logger

This file provides guidance to Claude Code when working with the logger package.

## Package Overview

`@kintone/logger` is a lightweight logging utility designed for kintone CLI tools. It provides structured logging with level-based filtering and customizable output.

## Architecture

### Core Components

1. **StandardLogger** (`src/logger.ts`)
   - Main logger implementation
   - Handles log level filtering
   - Formats messages with timestamps
   - Supports custom printers

2. **Types** (`src/types.ts`)
   - Logger interface
   - Log level definitions
   - Type exports

3. **Public API** (`src/index.ts`)
   - `logger`: Pre-configured logger instance
   - `StandardLogger`: Class for custom instances
   - `LOG_CONFIG_LEVELS`: Array of valid log levels (for CLI choices)
   - `LogConfigLevel`: Type for log configuration

## Development Guidelines

### File Structure

```
src/
├── index.ts        # Public API exports
├── logger.ts       # StandardLogger implementation
└── types.ts        # Type definitions
```

### Code Style

- Use TypeScript strict mode
- No runtime dependencies (keep it lightweight)
- Prefer composition over inheritance
- Keep methods focused and single-purpose

### Testing

Run tests with:
```bash
pnpm test
```

Test coverage should include:
- All log levels (trace, debug, info, warn, error, fatal)
- Log level filtering logic
- Message formatting
- Custom printer support
- Error object handling

### Building

Build the package:
```bash
pnpm build
```

This compiles TypeScript to JavaScript in the `lib/` directory.

### Linting

```bash
pnpm lint      # Check for issues
pnpm fix       # Auto-fix issues
```

## Implementation Notes

### Log Level Filtering

The logger uses a numeric ordering system to determine which messages to print:

```typescript
// LEVEL_ORDER is generated from LOG_CONFIG_LEVELS
const LEVEL_ORDER = LOG_CONFIG_LEVELS.reduce(
  (acc, level, index) => {
    acc[level] = index;
    return acc;
  },
  {} as Record<LogConfigLevel, number>,
);

// Level filtering uses simple numeric comparison
private isPrintable(event: LogEvent): boolean {
  if (this.logConfigLevel === "none") return false;
  return LEVEL_ORDER[event.level] >= LEVEL_ORDER[this.logConfigLevel];
}
```

This approach is more efficient than the matrix-based approach, using O(1) object lookup instead of array operations.

### Message Formatting

- Timestamps use ISO 8601 format
- Log levels are displayed in uppercase (using `event.level.toUpperCase()`)
- Multi-line messages are split and prefixed individually
- Error objects are converted to strings using `.toString()`
- All other values use `String(value)`

### Custom Printers

The default printer is `console.error`, but custom printers can be provided:

```typescript
const logger = new StandardLogger({
  printer: (message) => {
    // Custom logic (e.g., write to file, send to logging service)
  }
});
```

## Common Tasks

### Adding a New Log Level

1. Add the new level to `LOG_CONFIG_LEVELS` array in `src/types.ts`
2. `LogConfigLevel` type will be automatically updated (derived from array)
3. `LogEventLevel` type will be automatically updated (uses `Exclude<LogConfigLevel, "none">`)
4. Add method to `Logger` interface
5. Add method to `StandardLogger` class
6. `LEVEL_ORDER` will be automatically updated (generated from `LOG_CONFIG_LEVELS`)
7. Add tests for the new level

Note: Most type definitions are derived from `LOG_CONFIG_LEVELS` as the single source of truth, so changes propagate automatically.

### Modifying Message Format

Edit the `format()` method in `src/logger.ts`. Keep in mind:
- The format is used by CLI tools that parse output
- Changes may affect downstream consumers
- Maintain backwards compatibility when possible

The current format uses `toUpperCase()` to convert log levels to uppercase for display, while keeping the internal representation lowercase for consistency with CLI options.

## Dependencies

This package has ZERO runtime dependencies to keep it lightweight. Only dev dependencies are:
- `vitest` - Testing framework
- `rimraf` - Clean build artifacts

## Publishing

This package is currently private (`"private": true` in package.json). If it needs to be published:

1. Remove `"private": true`
2. Ensure version follows semver
3. Run `pnpm build` and `pnpm test`
4. Publish with `npm publish` (configured for public access)

## Related Packages

This logger is designed to be used by:
- `cli-kintone` - CSV import/export CLI
- Other kintone CLI tools in the monorepo

When making changes, consider the impact on these consumers.
