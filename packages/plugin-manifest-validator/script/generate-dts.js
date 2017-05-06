'use strict';

const fs = require('fs');
const json2ts = require('json-schema-to-typescript');
const compileFromFile = json2ts.compileFromFile;

compileFromFile('./manifest-schema.json')
  .then(ts => fs.writeFileSync('manifest-schema.d.ts', ts));
