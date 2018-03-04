'use strict';

/**
 * @param {!Array<{keyword: string, dataPath: string, message: string, params: {allowedValues: string[]}}>} errors
 * @return {!Array<string>}
 */
function generateErrorMessages(errors) {
  return errors.map(e => {
    if (e.keyword === 'enum') {
      return `"${e.dataPath}" ${e.message} (${e.params.allowedValues
        .map(v => `"${v}"`)
        .join(', ')})`;
    } else {
      return `"${e.dataPath}" ${e.message}`;
    }
  });
}

module.exports = generateErrorMessages;
