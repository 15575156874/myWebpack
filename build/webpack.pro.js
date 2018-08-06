const merge = require('webpack-merge');
const common = require('./webpack.common.js');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
    mode: 'production',
    optimization: {
        minimizer: [
            new UglifyJsPlugin({ test: /\.js($|\?)/i, uglifyOptions: { compress: { drop_console: true } } }),
            new OptimizeCssAssetsPlugin({}),
        ],
    },
}) 