const {merge} = require('webpack-merge');
const path = require('path');
const baseConfig = require('./webpack.base');

module.exports = merge(baseConfig, {
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 9000,
  },
  devtool: 'inline-source-map',
  mode: 'development',
});
