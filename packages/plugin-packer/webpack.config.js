'use strict';

const path = require('path');

module.exports = {
  entry: './site/index.js',
  output: {
    path: path.resolve(__dirname, 'docs', 'dist'),
    filename: 'bundle.js',
  },
  node: {
    fs: 'empty',
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'docs'),
    publicPath: '/dist/',
    watchContentBase: true,
    open: true,
  },
};
