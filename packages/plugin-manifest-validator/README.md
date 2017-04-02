kintone-plugin-manifest-validator
====

[![npm version][npm-image]][npm-url]
![Node.js Version Support][node-version]
[![build status][circleci-image]][circleci-url]
[![windows build status][appveyor-image]][appveyor-url]
[![dependency status][deps-image]][deps-url]
![License][license]

# How to install

```console
$ npm install @teppeis/kintone-plugin-packer
```

# Usage

```js
const validator = require('@teppeis/kintone-plugin-manifest-validator');

const result = validator(manifestJson);
console.log(result.valid); // boolean
console.log(result.errors); // [{field: string, message: string}]
```

## License

MIT License: Teppei Sato &lt;teppeis@gmail.com&gt;

[npm-image]: https://img.shields.io/npm/v/@teppeis/kintone-plugin-manifest-validator.svg
[npm-url]: https://npmjs.org/package/@teppeis/kintone-plugin-manifest-validator
[npm-downloads-image]: https://img.shields.io/npm/dm/@teppeis/kintone-plugin-manifest-validator.svg
[travis-image]: https://img.shields.io/travis/teppeis/kintone-plugin-manifest-validator/master.svg
[travis-url]: https://travis-ci.org/teppeis/kintone-plugin-manifest-validator
[circleci-image]: https://circleci.com/gh/teppeis/kintone-plugin-manifest-validator.svg?style=svg
[circleci-url]: https://circleci.com/gh/teppeis/kintone-plugin-manifest-validator
[appveyor-image]: https://ci.appveyor.com/api/projects/status/KEY?svg=true
[appveyor-url]: https://ci.appveyor.com/project/teppeis/kintone-plugin-manifest-validator/branch/master
[deps-image]: https://img.shields.io/david/teppeis/kintone-plugin-manifest-validator.svg
[deps-url]: https://david-dm.org/teppeis/kintone-plugin-manifest-validator
[node-version]: https://img.shields.io/badge/Node.js%20support-v4,v6,v7-brightgreen.svg
[coverage-image]: https://img.shields.io/coveralls/teppeis/kintone-plugin-manifest-validator/master.svg
[coverage-url]: https://coveralls.io/github/teppeis/kintone-plugin-manifest-validator?branch=master
[license]: https://img.shields.io/npm/l/@teppeis/kintone-plugin-manifest-validator.svg
