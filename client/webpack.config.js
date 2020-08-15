const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isRunningDevServer = process.env.WEBPACK_DEV_SERVER


module.exports = {
  entry: path.join(__dirname, 'src/main.js'),
  output: {
    filename: 'assets/js/[name].[contenthash].js',
    publicPath: '/'
  },
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    // ignore using CleanWebpackPlugin with dev server
    ...(
      isRunningDevServer
        ? []
        : [new CleanWebpackPlugin()]
    ),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html')
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[contenthash].css'
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(jpg|jpeg|png)/i,
        loader: 'file-loader',
        options: {
          name: '[name].[contenthash].[ext]',
          outputPath: 'assets/img' 
        }
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ]
  }
}