"use strict";

/**
 * @param {string} str
 * @param {boolean=} opt_allowHttp
 * @return {boolean}
 */
function validateHttpsUrl(str, opt_allowHttp) {
  return opt_allowHttp ? /^https?:/.test(str) : /^https:/.test(str);
}

module.exports = validateHttpsUrl;
