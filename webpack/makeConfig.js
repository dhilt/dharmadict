'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const pkg = require('../package.json');

function makeWebpackConfig(options) {
  let entry, plugins, devtool;

  console.log('Running Webpack in ' + (options.prod ? 'prod' : 'dev') + ' mode');

  if (options.prod) {
    entry = {
      app: path.resolve(__dirname, '../app/index.js'),
      vendor: Object.keys(pkg.dependencies)
    };

    plugins = [
      new CleanWebpackPlugin(['client'], {
        root: path.resolve(__dirname, '../', 'prod'),
        allowExternal: true
      }),
      new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.min.js'),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      new HtmlWebpackPlugin({
        template: './app/index.html',
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        }
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      })
    ]
  } else {
    devtool = 'source-map';

    entry = [
      'webpack-dev-server/client?http://localhost:5000',
      'webpack/hot/only-dev-server',
      path.resolve(__dirname, '../app/index.js')
    ];

    plugins = [
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        template: './app/index.html',
        favicon: './app/styles/images/favicon.ico'
      })
    ]
  }

  return {
    devtool: devtool,
    entry: entry,
    output: {
      path: path.resolve(__dirname, '../', 'prod', 'client'),
      filename: 'bundle.min.js'
    },
    module: {
      loaders: [
        {
          test: /\.js$/, // Transform all .js files required somewhere within an entry point...
          loader: 'babel', // ...with the specified loaders...
          exclude: path.join(__dirname, '../', '/node_modules/'), // ...except for the node_modules folder.
          query: {
            plugins: options.prod ? [
              ["react-remove-properties", {"properties": ["data-test-id"]}]
            ] : []
          }
        }, {
          test: /\.json$/,
          loader: 'json-loader'
        }, {
          test: /\.css$/, // Transform all .css files required somewhere within an entry point...
          loaders: ['style-loader', 'css-loader', 'postcss-loader'] // ...with PostCSS
        }, {
          test: /\.(png|jpg|gif)$/,
          loader: 'url-loader?limit=200000&context=./assets'
        }, {
          test: /\.(ttf|ico)$/,
          loader: 'file?name=[name].[ext]'
        }
      ]
    },
    plugins: plugins,
    postcss: function () {
      return [
        require('postcss-import')({
          onImport: function (files) {
            files.forEach(this.addDependency)
          }.bind(this)
        }),
        require('postcss-simple-vars')(),
        require('postcss-focus')(),
        require('autoprefixer')({
          browsers: ['last 2 versions', 'IE > 8']
        }),
        require('postcss-reporter')({
          clearMessages: true
        })
      ]
    },
    target: 'web',
    stats: !options.prod,
    progress: true
  }
}

module.exports = makeWebpackConfig;
