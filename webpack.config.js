const path = require('path')
const HtmlWebpack = require('html-webpack-plugin')
const config = require('./config.json')

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
        title: config.pagetitle
      }
    })
  ]
}
