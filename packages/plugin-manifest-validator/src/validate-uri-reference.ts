"use strict";

// https://github.com/ajv-validator/ajv-formats/blob/master/src/formats.ts#L118
export const URI_REFERENCE_PATTERN =
  /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i;

/**
 * @param {string} str
 * @return {boolean}
 */
export const validateUriReference = (str: string): boolean => {
  return URI_REFERENCE_PATTERN.test(str);
};
