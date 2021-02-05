/**
 * Create content file list from manifest.json
 */
export function sourceList(
  // TODO: Define and use menifest type
  manifest: any
): string[] {
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
  return Array.from(new Set(list));
}
