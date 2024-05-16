const fs = require("fs");
const path = require("path");

const sourceFile = path.join(__dirname, "..", "dist", "index.js");
const shebangFile = path.join(__dirname, "..", "resources", "shebang.txt");
const tmpFile = path.join(__dirname, "..", "dist", "index.js.tmp");

// Read the shebang
const shebangContent = fs.readFileSync(shebangFile, "utf8");

// Read the original dist/index.js
const originalContent = fs.readFileSync(sourceFile, "utf8");

// Concatenate and write to temp file
fs.writeFileSync(tmpFile, shebangContent + originalContent);

// Replace original file with temp file
fs.renameSync(tmpFile, sourceFile);
