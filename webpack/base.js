const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin  = require('copy-webpack-plugin')

module.exports = {
  mode: "development",
  devtool: "eval-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: "css-loader"
          }
        ]
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: "raw-loader"
      },
      {
        test: /\.(gif|png|jpe?g|svg|xml)$/i,
        use: "file-loader"
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      root: path.resolve(__dirname, "../")
    }),
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true),
      'process.env.ENV': `'${process.env.ENV}'`,
    }),
    new HtmlWebpackPlugin({
      template: "./index.html",
      externals: process.env.ENV === 'prod' ? [
        {
          script: '<script crossorigin="anonymous" integrity="sha512-2kb3Q9IR7K9be52kC2yJGEflRxcLWqIzKlwki1I6Y9TMP2sqneTYdbYe1b/+7EJyr2c8mBH6/QrlC+eqbvJdSg==" src="https://lib.baomitu.com/phaser/3.50.1/phaser.min.js"></script>'
        }
      ] : []
    }),
    new CopyWebpackPlugin({
      patterns: [{
        from: path.resolve(__dirname, "../src/public"),
        to: './public'
      }]
    })
  ],
};
