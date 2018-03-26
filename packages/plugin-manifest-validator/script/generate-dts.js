'use strict';

const fs = require('fs');
const {compile} = require('json-schema-to-typescript');
const schema = require('../manifest-schema.json');

delete schema.definitions.resources.items.anyOf;

compile(schema, 'manifest-schema.json').then(dts => fs.writeFileSync('manifest-schema.d.ts', dts));
