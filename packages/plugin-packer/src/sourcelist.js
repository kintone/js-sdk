"use strict";

/**
 * Create content file list from manifest.json
 *
 * @param {!Object} manifest
 * @return {!Array<string>}
 */
function sourceList(manifest) {
  const sourceTypes = [
    ["desktop", "js"],
    ["desktop", "css"],
    ["mobile", "js"],
    ["mobile", "css"],
    ["config", "js"],
    ["config", "css"],
  ];
  const list = sourceTypes
    .map((t) => manifest[t[0]] && manifest[t[0]][t[1]])
    .filter((i) => !!i)
    .reduce((a, b) => a.concat(b), [])
    .filter((file) => !/^https?:\/\//.test(file));
  if (manifest.config && manifest.config.html) {
    list.push(manifest.config.html);
  }
  list.push("manifest.json", manifest.icon);
  // Make the file list unique
  return [...new Set(list)];
}

module.exports = sourceList;
