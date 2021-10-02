const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const htmlPluginOpts = {
  template: './src/index.html',
  scriptLoading: 'defer',
  favicon: './src/favicon.ico'
}

const miniCssPluginOpts = {
  filename: 'assets/css/[name].css'
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
      },
      {
        test: /s(a|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
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
  },
  optimization: {
    minimizer: [
      `...`,
      new CssMinimizerPlugin()
    ],
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new HtmlWebpackPlugin(htmlPluginOpts),
    new MiniCssExtractPlugin(miniCssPluginOpts)
  ]
}
