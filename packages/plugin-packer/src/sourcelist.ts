"use strict";

/**
 * Create content file list from manifest.json
 *
 * @param {!Object} manifest
 * @return {!Array<string>}
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sourceList... Remove this comment to see the full error message
function sourceList(manifest: any) {
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
    .filter((file: any) => !/^https?:\/\//.test(file));
  if (manifest.config && manifest.config.html) {
    list.push(manifest.config.html);
  }
  list.push("manifest.json", manifest.icon);
  // Make the file list unique
  // @ts-expect-error ts-migrate(2569) FIXME: Type 'Set<unknown>' is not an array type or a stri... Remove this comment to see the full error message
  return [...new Set(list)];
}

module.exports = sourceList;
