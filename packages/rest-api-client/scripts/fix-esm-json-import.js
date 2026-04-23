#!/usr/bin/env node
/**
 * Fix ESM JSON imports by adding import attributes
 *
 * This script adds `with { type: "json" }` to JSON imports in ESM output files
 * to comply with Node.js ESM requirements.
 */

const fs = require('fs');
const path = require('path');

const filesToFix = [
  'esm/src/platform/node.js',
  'esm/src/platform/browser.js',
];

filesToFix.forEach(filePath => {
  const fullPath = path.join(__dirname, '..', filePath);

  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf-8');
  const originalContent = content;

  // Add import attributes to package.json imports
  content = content.replace(
    /import packageJson from "\.\.\/\.\.\/package\.json";/g,
    'import packageJson from "../../package.json" with { type: "json" };'
  );

  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`✅ Fixed JSON import in ${filePath}`);
  } else {
    console.log(`ℹ️  No changes needed in ${filePath}`);
  }
});

console.log('✨ ESM JSON import fix completed');
