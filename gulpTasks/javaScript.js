// JavaScripts
//******************************************
import statsLogger from 'webpack-stats-logger';
import gulp from 'gulp';
import path from 'path';
import changed from 'gulp-changed';
import debug from 'gulp-debug';

import webpack from 'webpack';
import gulpWebpack from 'webpack-stream';

import makeWebpackConfig  from '../webpack.conf.js';

const args = require('yargs').argv;

gulp.task('jsApp', function() {

  return gulp.src('./source/js/app.js')
    .pipe(gulpWebpack({
      entry: {
        app: './source/js/app',
        common: './source/js/common'
      },
      resolve: {
        modules: [
          'node_modules'
        ]
      },
      devtool: (args.dev) ? 'cheap-module-eval-source-map': false,
      output: {
        filename: '[name].js',
        chunkFilename: '[id].chunk.js',
        publicPath: ''
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            include: [
              path.resolve(__dirname, 'source/js/')
            ],
            exclude: [
              path.resolve(__dirname, 'node_modules/')
            ],
            loader: 'babel-loader',
            options: {
              presets: ['es2015']
            }
          }
        ]
      },
      plugins: [
        new webpack.ProvidePlugin({
          '$': 'jquery'
        }),
        new webpack.optimize.CommonsChunkPlugin({
          name: 'common',
          minChunks: 3
        }),
        new webpack.DefinePlugin({
          NODE_ENV: JSON.stringify((args.dev) ? 'develop' : 'production')
        })
      ].concat(args.dev ? [
      ] : [
        new  webpack.optimize.UglifyJsPlugin({
          sourceMap: false
        }),
        new webpack.LoaderOptionsPlugin({
          minimize: true
        })
      ])

    }, webpack))
    .pipe(gulp.dest('./build/js/'));
});
