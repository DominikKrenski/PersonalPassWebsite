const fs = require('fs');
const path = require('path');
const { merge } = require('webpack-merge');

const commonConfig = require('./webpack.common');

const devConfig = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    client: {
      logging: 'info'
    },
    compress: true,
    https: {
      cert: fs.readFileSync(path.join(__dirname, '..', 'certs', 'personal-pass.crt')),
      key: fs.readFileSync(path.join(__dirname, '..', 'certs', 'personal-pass.key'))
    },
    historyApiFallback: true,
    host: 'personal-pass.dev',
    hot: true,
    port: 443
  },
  module: {
    rules: [
      {
        test: /\.s(a|c)ss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 3,
              url: true,
              import: true
            }
          },
          {
            loader: 'scoped-css-loader'
          },
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  }
}

module.exports = merge(commonConfig, devConfig);
