"use strict";

const N_TO_A = "a".charCodeAt(0) - "0".charCodeAt(0);
const A_TO_K = "k".charCodeAt(0) - "a".charCodeAt(0);

/**
 * `tr '0-9a-f' 'a-p'` in JS
 *
 * @param {string} hex like '8a7f7d'
 * @return {string}
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hex2a'.
function hex2a(hex: any) {
  return Array.from(hex)
    .map((s) => {
      // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
      if (s >= "0" && s <= "9") {
        // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
        return String.fromCharCode(s.charCodeAt(0) + N_TO_A);
      // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
      } else if (s >= "a" && s <= "f") {
        // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
        return String.fromCharCode(s.charCodeAt(0) + A_TO_K);
      }
      throw new Error(`invalid char: ${s}`);
    })
    .join("");
}

module.exports = hex2a;
