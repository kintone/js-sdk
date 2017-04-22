'use strict';

const formats = require('ajv/lib/compile/formats');

/**
 * @param {string} str
 * @param {boolean=} opt_allowHttp
 * @return {boolean}
 */
function validateHttpsUrl(str, opt_allowHttp) {
  if (formats.full.url.test(str)) {
    if (opt_allowHttp) {
      return /^https?:/.test(str);
    } else {
      return /^https:/.test(str);
    }
  }
  return false;
}

module.exports = validateHttpsUrl;
