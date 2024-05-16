const fs = require("fs");
const path = require("path");

const sourceFile = path.join(__dirname, "..", "dist", "index.js");
const shebangFile = path.join(__dirname, "..", "resources", "shebang.txt");

const shebangContent = fs.readFileSync(shebangFile, "utf8");
const originalContent = fs.readFileSync(sourceFile, "utf8");

fs.writeFileSync(sourceFile, shebangContent + originalContent);
