import { beforeAll } from "vitest";

beforeAll(() => {
  // Import Web APIs from undici for Node.js environment
  try {
    const { File, FormData, Blob } = require("undici");
    
    if (typeof globalThis.File === "undefined") {
      globalThis.File = File;
    }
    
    if (typeof globalThis.FormData === "undefined") {
      globalThis.FormData = FormData;
    }
    
    if (typeof globalThis.Blob === "undefined") {
      globalThis.Blob = Blob;
    }
  } catch (error) {
    console.warn("Failed to import Web APIs from undici:", error);
  }
});