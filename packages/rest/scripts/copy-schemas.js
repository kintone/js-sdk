import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sourceDir = path.join(__dirname, "..", "src", "schemas");
const libTargetDir = path.join(__dirname, "..", "lib", "src", "schemas");
const esmTargetDir = path.join(__dirname, "..", "esm", "src", "schemas");

// eslint-disable-next-line n/no-unsupported-features/node-builtins
fs.cpSync(sourceDir, libTargetDir, { recursive: true });
// eslint-disable-next-line n/no-unsupported-features/node-builtins
fs.cpSync(sourceDir, esmTargetDir, { recursive: true });
