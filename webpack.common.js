const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const htmlPluginOpts = {
  template: './src/index.html',
  scriptLoading: 'defer',
  favicon: './src/favicon.ico'
}

const copyPluginOpts = {
  patterns: [
    { from: './src/assets/locales/en/translation.json', to: 'assets/locales/en/translation.json', force: true },
    { from: './src/assets/locales/pl/translation.json', to: 'assets/locales/pl/translation.json', force: true }
  ]
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
      },
      {
        test: /\.ttf$/,
        exclude: /node_modules/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[hash][ext][query]'
        }
      },
      {
        test: /\.(png|jpe?g)$/,
        exclude: /node_modules/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/img/[hash][ext][query]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin(htmlPluginOpts),
    new CopyPlugin(copyPluginOpts)

    //new CopyPlugin({
    //  patterns: [
    //    { from: path.join(__dirname, '/src/assets/locales/en/translation.json'), to: 'copied/', force: true }
    //  ]
    //})
  ]
}
