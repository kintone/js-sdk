type Platform = "Browser" | "Node.js";

export class UnsupportedPlatformError extends Error {
  public platform: Platform;

  constructor(platform: Platform) {
    const message = `This function is not supported in ${platform} environment`;
    super(message);

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Custom_Error_Types
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnsupportedPlatformError);
    }

    this.name = "UnsupportedPlatformError";
    this.platform = platform;

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, UnsupportedPlatformError.prototype);
  }
}
