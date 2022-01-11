@kintone/plugin-manifest-validator
====

[![npm version](https://badge.fury.io/js/%40kintone%2Fplugin-manifest-validator.svg)](https://badge.fury.io/js/%40kintone%2Fplugin-manifest-validator)
![Node.js version](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/kintone/js-sdk/master/packages/create-plugin/package.json&label=node&query=$.engines.node&colorB=blue)
![License](https://img.shields.io/npm/l/@kintone/plugin-manifest-validator.svg)

Validate `manifest.json` of kintone plugin. Used in [@kintone/plugin-packer](https://github.com/kintone/plugin-packer).

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

[ajv error objects](https://ajv.js.org/api.html#error-objects) is like:

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
