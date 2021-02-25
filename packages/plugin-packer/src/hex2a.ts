const N_TO_A = "a".charCodeAt(0) - "0".charCodeAt(0);
const A_TO_K = "k".charCodeAt(0) - "a".charCodeAt(0);

/**
 * `tr '0-9a-f' 'a-p'` in JS
 */
export function hex2a(hex: string): string {
  return Array.from(hex)
    .map((s) => {
      if (s >= "0" && s <= "9") {
        return String.fromCharCode(s.charCodeAt(0) + N_TO_A);
      } else if (s >= "a" && s <= "f") {
        return String.fromCharCode(s.charCodeAt(0) + A_TO_K);
      }
      throw new Error(`invalid char: ${s}`);
    })
    .join("");
}
