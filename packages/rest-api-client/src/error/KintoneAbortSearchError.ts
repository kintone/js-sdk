export class KintoneAbortSearchError extends Error {
  constructor(message: string) {
    super(message);

    this.name = "KintoneAbortSearchError";
    this.message = message;

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, KintoneAbortSearchError.prototype);
  }
}
