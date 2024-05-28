"use strict";

// https://github.com/ajv-validator/ajv-formats/blob/4ca86d21bd07571a30178cbb3714133db6eada9a/src/formats.ts#L117C8-L117C52
export const URI_PATTERN = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i;

/**
 * @param {string} str
 * @return {boolean}
 */
export const validateUri = (str: string): boolean => {
  return URI_PATTERN.test(str);
};
