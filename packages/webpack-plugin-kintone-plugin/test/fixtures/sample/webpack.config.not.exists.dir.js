'use strict';

const path = require('path');
const KintonePlugin = require(path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  'dist',
  'src',
  'index'
));

module.exports = {
  entry: {
    customize: './src/customize.js'
  },
  output: {
    path: path.resolve(__dirname, 'plugin', 'js'),
    filename: '[name].js'
  },
  plugins: [
    new KintonePlugin({
      pluginZipPath: 'dist/new/to/plugin.zip'
    })
  ]
};
