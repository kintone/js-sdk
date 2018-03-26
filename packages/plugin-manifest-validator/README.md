kintone-plugin-manifest-validator
====

Validate `manifest.json` of kintone plugin. Used in [kintone-plugin-packer](https://github.com/teppeis/kintone-plugin-packer).

[![npm version][npm-image]][npm-url]
![Node.js Version Support][node-version]
[![build status][circleci-image]][circleci-url]
[![appveyor status][appveyor-image]][appveyor-url]
[![dependency status][deps-image]][deps-url]
![License][license]

## How to install

```console
$ npm install @teppeis/kintone-plugin-packer
```

## Usage

```js
const validator = require('@teppeis/kintone-plugin-manifest-validator');

const manifestJson = require('path/to/your/manifest.json');
const result = validator(manifestJson);
console.log(result.valid); // true or false
console.log(result.errors); // array of ajv error objects
```

[ajv error objects](https://github.com/epoberezkin/ajv#validation-errors) is like:

```js
{
  dataPath: '.version',
  keyword: 'type',
  message: 'should be integer',
  params: {
    type: 'integer',
  },
  schemaPath: '#/properties/version/type',
}
```

## `manifest-json.d.ts`

```js
import {KintonePluginManifestJson} from '@teppeis/kintone-plugin-manifest-validator/manifest-schema';

let manifest: KintonePluginManifestJson;
```

## License

MIT License: Teppei Sato &lt;teppeis@gmail.com&gt;

[npm-image]: https://img.shields.io/npm/v/@teppeis/kintone-plugin-manifest-validator.svg
[npm-url]: https://npmjs.org/package/@teppeis/kintone-plugin-manifest-validator
[npm-downloads-image]: https://img.shields.io/npm/dm/@teppeis/kintone-plugin-manifest-validator.svg
[travis-image]: https://img.shields.io/travis/teppeis/kintone-plugin-manifest-validator/master.svg
[travis-url]: https://travis-ci.org/teppeis/kintone-plugin-manifest-validator
[circleci-image]: https://circleci.com/gh/teppeis/kintone-plugin-manifest-validator.svg?style=shield
[circleci-url]: https://circleci.com/gh/teppeis/kintone-plugin-manifest-validator
[appveyor-image]: https://ci.appveyor.com/api/projects/status/pcsvpsj4ff8u4jop/branch/master?svg=true
[appveyor-url]: https://ci.appveyor.com/project/teppeis/kintone-plugin-manifest-validator/branch/master
[deps-image]: https://img.shields.io/david/teppeis/kintone-plugin-manifest-validator.svg
[deps-url]: https://david-dm.org/teppeis/kintone-plugin-manifest-validator
[node-version]: https://img.shields.io/badge/Node.js%20support-v6,v8,v9-brightgreen.svg
[coverage-image]: https://img.shields.io/coveralls/teppeis/kintone-plugin-manifest-validator/master.svg
[coverage-url]: https://coveralls.io/github/teppeis/kintone-plugin-manifest-validator?branch=master
[license]: https://img.shields.io/npm/l/@teppeis/kintone-plugin-manifest-validator.svg
