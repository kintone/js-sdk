@kintone/plugin-manifest-validator
====

Validate `manifest.json` of kintone plugin. Used in [@kintone/plugin-packer](https://github.com/kintone/plugin-packer).

[![npm version][npm-image]][npm-url]
![Node.js Version Support][node-version]
[![build status][circleci-image]][circleci-url]
[![build status][travisci-image]][travisci-url]
[![dependency status][deps-image]][deps-url]
![License][license]

## How to install

```console
$ npm install @kintone/plugin-manifest-validator
```

## Usage

```js
const validator = require('@kintone/plugin-manifest-validator');

const manifestJson = require('./path/to/your/manifest.json');
const result = validator(manifestJson);
console.log(result.valid); // true or false
console.log(result.errors); // array of ajv error objects
```

[ajv error objects](https://ajv.js.org/docs/api.html#validation-errors) is like:

```js
{
  dataPath: '/version',
  keyword: 'type',
  message: 'should be integer',
  params: {
    type: 'integer',
  },
  schemaPath: '#/properties/version/type',
}
```
## `manifest-schema.json`

JSON schema for manifest.json is available.

```js
const manifestJsonSchema = require('@kintone/plugin-manifest-validator/manifest-schema.json');
```

## `manifest-schema.d.ts`

TypeScript type definition (d.ts) for manifest.json is available.

```typescript
import {KintonePluginManifestJson} from '@kintone/plugin-manifest-validator/manifest-schema';

let manifest: KintonePluginManifestJson;
```

## License

MIT License

[npm-image]: https://img.shields.io/npm/v/@kintone/plugin-manifest-validator.svg
[npm-url]: https://npmjs.org/package/@kintone/plugin-manifest-validator
[circleci-image]: https://circleci.com/gh/kintone/plugin-manifest-validator.svg?style=shield
[circleci-url]: https://circleci.com/gh/kintone/plugin-manifest-validator
[travisci-image]: https://travis-ci.org/kintone/plugin-manifest-validator.svg?branch=master
[travisci-url]: https://travis-ci.org/kintone/plugin-manifest-validator
[deps-image]: https://img.shields.io/david/kintone/plugin-manifest-validator.svg
[deps-url]: https://david-dm.org/kintone/plugin-manifest-validator
[node-version]: https://img.shields.io/badge/Node.js%20support-v6,v8,v10-brightgreen.svg
[license]: https://img.shields.io/npm/l/@kintone/plugin-manifest-validator.svg
