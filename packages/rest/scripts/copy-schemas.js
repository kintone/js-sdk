const fs = require("fs");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "src", "schemas");
const libTargetDir = path.join(__dirname, "..", "lib", "src", "schemas");
const esmTargetDir = path.join(__dirname, "..", "esm", "src", "schemas");

// eslint-disable-next-line n/no-unsupported-features/node-builtins
fs.cpSync(sourceDir, libTargetDir, { recursive: true });
// eslint-disable-next-line n/no-unsupported-features/node-builtins
fs.cpSync(sourceDir, esmTargetDir, { recursive: true });
