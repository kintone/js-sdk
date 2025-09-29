/* eslint-disable n/no-unsupported-features/node-builtins */
// Import basic Blob from Node.js buffer module first
if (typeof globalThis.Blob === "undefined") {
  const { Blob } = require("buffer");
  globalThis.Blob = Blob;
}

// Define minimal File implementation to satisfy undici
if (typeof globalThis.File === "undefined") {
  globalThis.File = class File extends globalThis.Blob {
    constructor(fileBits, fileName, options = {}) {
      super(fileBits, options);
      this.name = fileName;
      this.lastModified = options.lastModified || Date.now();
    }
  };
}

// Import FormData from undici after File is defined
try {
  const { FormData } = require("undici");
  if (typeof globalThis.FormData === "undefined") {
    globalThis.FormData = FormData;
  }
} catch (error) {
  console.warn("Failed to import FormData from undici:", error);
}
