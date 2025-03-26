const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..', 'src', 'schemas');
const libTargetDir = path.join(__dirname, '..', 'lib', 'src', 'schemas');
const esmTargetDir = path.join(__dirname, '..', 'esm', 'src', 'schemas');

fs.cpSync(sourceDir, libTargetDir, { recursive: true });
fs.cpSync(sourceDir, esmTargetDir, { recursive: true });
