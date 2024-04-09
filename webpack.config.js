'use strict';

//built my html file and connected script tag automatically
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
require('dotenv').config();

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: path.join(__dirname, './src/index.js'),
  output: {
    filename: 'main.js',
    path: path.join(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|pdf|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public/index.html'), // Specify the path to your HTML template
      filename: 'index.html', // Output HTML file name
    }),
  ],
};