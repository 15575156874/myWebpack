const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
function resolve(dir) {
    return path.join(__dirname, dir)
}
console.log('================', resolve(`../src/${process.env.ENV_file}/dependencies`))
module.exports = merge(common, {
    mode: 'production',
    plugins: [
        // new BundleAnalyzerPlugin()
    ],
    optimization: {
        minimizer: [
            new UglifyJsPlugin({ test: /\.js($|\?)/i, uglifyOptions: { compress: { drop_console: true } } }),
            new OptimizeCssAssetsPlugin({}),
        ],
        //runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                libs: {
                    name: `${process.env.ENV_file}Chunk`,
                    priority: 10,
                    //misChunks:0,
                    test: /[\\/]dependencies[\\/]///resolve(`../src/${process.env.ENV_file}/dependencies`),
                }
                //   elementUI: {
                //     name: 'chunk-elementUI', // 单独将 elementUI 拆包
                //     priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
                //     test: /[\\/]node_modules[\\/]dependencies[\\/]/
                //   },
                //   commons: {
                //     name: 'chunk-comomns',
                //     test: resolve("src/components"), // 可自定义拓展你的规则
                //     minChunks: 3, // 最小公用次数
                //     priority: 5,
                //     reuseExistingChunk: true
                //   },
            }
        }
    },
}) 