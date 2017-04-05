'use strict';

const URL = require('isomorphic-url').URL;

/**
 * @param {string} str
 * @param {boolean=} opt_allowHttp
 * @return {boolean}
 */
function validateHttpsUrl(str, opt_allowHttp) {
  const allowHttp = !!opt_allowHttp;
  try {
    const url = new URL(str);
    return url.protocol === 'https:' || (allowHttp && url.protocol === 'http:');
  } catch (e) {
    return false;
  }
}

module.exports = validateHttpsUrl;
