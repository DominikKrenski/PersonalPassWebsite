const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const htmlPluginOpts = {
  template: './src/index.html',
  scriptLoading: 'defer',
  favicon: './src/favicon.ico'
}

module.exports = {
  mode: 'production',
  devtool: 'source-map',
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
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new HtmlWebpackPlugin(htmlPluginOpts)
  ]
}
