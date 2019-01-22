#!/bin/sh -ex

npm run tsc

cat resources/shebang.txt dist/index.js > dist/index.js.tmp
mv dist/index.js.tmp dist/index.js

cp -v src/templates/*.njk dist/templates

npm run build:integration