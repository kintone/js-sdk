#!/bin/sh -ex

cat resources/shebang.txt dist/index.js > dist/index.js.tmp
mv dist/index.js.tmp dist/index.js
