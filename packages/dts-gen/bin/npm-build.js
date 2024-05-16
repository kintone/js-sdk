const fs = require("fs");
const path = require("path");

const sourceFile = path.join(__dirname, "..", "dist", "index.js");
const shebangFile = path.join(__dirname, "..", "resources", "shebang.txt");
const tmpFile = path.join(__dirname, "..", "dist", "index.js.tmp");

const shebangContent = fs.readFileSync(shebangFile, "utf8");
const originalContent = fs.readFileSync(sourceFile, "utf8");

fs.writeFileSync(tmpFile, shebangContent + originalContent);
fs.renameSync(tmpFile, sourceFile);
