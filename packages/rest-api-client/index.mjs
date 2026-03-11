let mod;
try {
  // Node.js: use the CommonJS entry via createRequire for compatibility
  const { createRequire } = await import("node:module");
  const require = createRequire(import.meta.url);
  mod = require(".");
} catch {
  // Non-Node runtimes (e.g. Cloudflare Workers): fall back to the ESM entry
  mod = await import("./esm/src/index.js");
}
export const {
  KintoneRestAPIClient,
  KintoneAbortSearchError,
  KintoneAllRecordsError,
  KintoneRestAPIError,
} = mod;
