const path = require('path');

module.exports = {
  entry: {
      'dts-gen-integration-test' : './src/integration-tests/dts-gen-integration-test.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.integration.json'
            },
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    fallback: {
      assert: false,
    },
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  }
};
