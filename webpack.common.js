const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const htmlPluginOpts = {
  template: './src/index.html',
  scriptLoading: 'defer',
  favicon: './src/favicon.ico'
}

module.exports = {
  entry: './src/main.js',
  output: {
    chunkFilename: '[id].js',
    clean: true,
    filename: '[name].[contenthash].bundle.js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.m?jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin(htmlPluginOpts)
  ]
}
