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
    { from: './src/assets/locales/en/home_banner.json', to: 'assets/locales/en/home_banner.json', force: true },
    { from: './src/assets/locales/pl/home_banner.json', to: 'assets/locales/pl/home_banner.json', force: true },
    { from: './src/assets/locales/en/home_info.json', to: 'assets/locales/en/home_info.json', force: true },
    { from: './src/assets/locales/pl/home_info.json', to: 'assets/locales/pl/home_info.json', force: true },
    { from: './src/assets/locales/en/home_navigation.json', to: 'assets/locales/en/home_navigation.json', force: true },
    { from: './src/assets/locales/pl/home_navigation.json', to: 'assets/locales/pl/home_navigation.json', force: true },
    { from: './src/assets/locales/en/login_form.json', to: 'assets/locales/en/login_form.json', force: true },
    { from: './src/assets/locales/pl/login_form.json', to: 'assets/locales/pl/login_form.json', force: true },
    { from: './src/assets/locales/en/registration_form.json', to: 'assets/locales/en/registration_form.json', force: true },
    { from: './src/assets/locales/pl/registration_form.json', to: 'assets/locales/pl/registration_form.json', force: true },
    { from: './src/assets/locales/en/app_counter.json', to: 'assets/locales/en/app_counter.json', force: true },
    { from: './src/assets/locales/pl/app_counter.json', to: 'assets/locales/pl/app_counter.json', force: true },
    { from: './src/assets/locales/en/confirmation.json', to: 'assets/locales/en/confirmation.json', force: true },
    { from: './src/assets/locales/pl/confirmation.json', to: 'assets/locales/pl/confirmation.json', force: true },
    { from: './src/assets/locales/en/logout_button.json', to: 'assets/locales/en/logout_button.json', force: true },
    { from: './src/assets/locales/pl/logout_button.json', to: 'assets/locales/pl/logout_button.json', force: true },
    { from: './src/assets/locales/en/secure_nav.json', to: 'assets/locales/en/secure_nav.json', force: true },
    { from: './src/assets/locales/pl/secure_nav.json', to: 'assets/locales/pl/secure_nav.json', force: true },
    { from: './src/assets/locales/en/password_hint.json', to: 'assets/locales/en/password_hint.json', force: true },
    { from: './src/assets/locales/pl/password_hint.json', to: 'assets/locales/pl/password_hint.json', force: true },
    { from: './src/assets/locales/en/account.json', to: 'assets/locales/en/account.json', force: true },
    { from: './src/assets/locales/pl/account.json', to: 'assets/locales/pl/account.json', force: true },
    { from: './src/assets/locales/en/email_update.json', to: 'assets/locales/en/email_update.json', force: true },
    { from: './src/assets/locales/pl/email_update.json', to: 'assets/locales/pl/email_update.json', force: true },
    { from: './src/assets/locales/en/password_update.json', to: 'assets/locales/en/password_update.json', force: true },
    { from: './src/assets/locales/pl/password_update.json', to: 'assets/locales/pl/password_update.json', force: true },
    { from: './src/assets/locales/en/data_table.json', to: 'assets/locales/en/data_table.json', force: true },
    { from: './src/assets/locales/pl/data_table.json', to: 'assets/locales/pl/data_table.json', force: true },
    { from: './src/assets/locales/en/address.json', to: 'assets/locales/en/address.json', force: true },
    { from: './src/assets/locales/pl/address.json', to: 'assets/locales/pl/address.json', force: true },
    { from: './src/assets/locales/en/address_form.json', to: 'assets/locales/en/address_form.json', force: true },
    { from: './src/assets/locales/pl/address_form.json', to: 'assets/locales/pl/address_form.json', force: true },
    { from: './src/assets/locales/en/data_row.json', to: 'assets/locales/en/data_row.json', force: true },
    { from: './src/assets/locales/pl/data_row.json', to: 'assets/locales/pl/data_row.json', force: true },
    { from: './src/assets/locales/en/site_form.json', to: 'assets/locales/en/site_form.json', force: true },
    { from: './src/assets/locales/pl/site_form.json', to: 'assets/locales/pl/site_form.json', force: true },
    { from: './src/assets/locales/en/site.json', to: 'assets/locales/en/site.json', force: true },
    { from: './src/assets/locales/pl/site.json', to: 'assets/locales/pl/site.json', force: true },
    { from: './src/assets/locales/en/password_form.json', to: 'assets/locales/en/password_form.json', force: true },
    { from: './src/assets/locales/pl/password_form.json', to: 'assets/locales/pl/password_form.json', force: true },
    { from: './src/assets/locales/en/password.json', to: 'assets/locales/en/password.json', force: true },
    { from: './src/assets/locales/pl/password.json', to: 'assets/locales/pl/password.json', force: true },
    { from: './src/assets/locales/en/note.json', to: 'assets/locales/en/note.json', force: true },
    { from: './src/assets/locales/pl/note.json', to: 'assets/locales/pl/note.json', force: true },
    { from: './src/assets/locales/en/note_form.json', to: 'assets/locales/en/note_form.json', force: true },
    { from: './src/assets/locales/pl/note_form.json', to: 'assets/locales/pl/note_form.json', force: true }
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
