'use strict';

const fs = require('fs');
const json2ts = require('json-schema-to-typescript');

const compile = json2ts.compile;
const json = require('../manifest-schema.json');

delete json.definitions.resources.items.anyOf;

compile(json)
  .then(ts => fs.writeFileSync('manifest-schema.d.ts', ts));
