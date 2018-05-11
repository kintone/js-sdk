"use strict";

/**
 * Print logs
 * @param texts
 */
export function printLog(...texts: string[]) {
  texts.forEach(t => console.log(t));
}

/**
 * Print errors
 * @param errors
 */
export function printError(...errors: string[]) {
  errors.forEach(e => console.error(e));
}
