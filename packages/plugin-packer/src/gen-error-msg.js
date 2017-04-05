'use strict';

/**
 * @param {!Array<{dataPath: string, message: string, params: {Object}}>} errors
 * @return {!Array<string>}
 */
function generateErrorMessages(errors) {
  return errors.map(e => {
    if (e.keyword === 'enum') {
      return `"${e.dataPath}" ${e.message} (${e.params.allowedValues.map(v => `"${v}"`).join(', ')})`;
    } else {
      return `"${e.dataPath}" ${e.message}`;
    }
  });
}

module.exports = generateErrorMessages;
