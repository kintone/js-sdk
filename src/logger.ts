"use strict";

/**
 * Print logs
 * @param texts
 */
export const printLog = (...texts: string[]) => {
  texts.forEach((t) => console.log(t));
};

/**
 * Print errors
 * @param errors
 */
export const printError = (...errors: string[]) => {
  errors.forEach((e) => console.error(e));
};
