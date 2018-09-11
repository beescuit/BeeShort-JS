require('dotenv').config()

const path = require('path')
const HtmlWebpack = require('html-webpack-plugin')

module.exports = {
  entry: './web/src/index.js',
  output: {
    path: path.join(__dirname, '/web/dist/'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(scss|sass|css)$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpack({
      template: './web/src/index.ejs',
      templateParameters: {
        title: process.env.PAGE_TITLE
      }
    })
  ]
}
