"use strict";

/**
 * @param {!Array<{keyword: string, dataPath: string, message: string, params: {allowedValues: string[]}}>} errors
 * @return {!Array<string>}
 */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'generateEr... Remove this comment to see the full error message
function generateErrorMessages(errors: any) {
  return errors.map((e: any) => {
    if (e.keyword === "enum") {
      return `"${e.dataPath}" ${e.message} (${e.params.allowedValues
        .map((v: any) => `"${v}"`)
        .join(", ")})`;
    }
    return `"${e.dataPath}" ${e.message}`;
  });
}

module.exports = generateErrorMessages;
