"use strict";

// We don't test behaviors depending on Browser
// so this defines minimum APIs to run the tests on Node without errors.
global.document = {
  querySelector() {},
  querySelectorAll() {},
  createElement() {},
};
global.URL = {
  createObjectURL: (data) => data,
};
class Blob {
  constructor(...args) {
    return args;
  }
}
global.Blob = Blob;
