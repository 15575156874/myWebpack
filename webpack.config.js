const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

//获得一个动态的目录
const glob = require('glob')
var obj = {
    detail: {},
    entry: {
        vender: './src/help/scripts/main.js'
    }
}
const htmlWebpackPluginDevConfig = { plugins: [] }
glob.sync("./src/**/**/*.html").forEach(e => { //同步
    let arr = e.split('/')
    function getDir(arr) {
        let arr1 = JSON.parse(JSON.stringify(arr))
        arr1.splice(-1)
        return arr1
    }
    const chunk = arr[arr.length - 1].split('.')[0]
    const filename = chunk + '.html'
    obj['detail'][chunk] = {
        name: chunk,
        path: e,
        dir: path.resolve(__dirname, `${getDir(arr).join('/')}`)
    }
    obj['entry'][chunk] = `${getDir(arr).join('/')}` + '/main.js'
    const htmlConf = {
        filename: filename,
        template: e,
        //favicon: './src/assets/images/favicon.ico',
        inject: 'body',
        chunks: [chunk]
    }
    htmlWebpackPluginDevConfig.plugins.push(new HtmlWebpackPlugin(htmlConf))
})

module.exports = {
    entry: obj.entry,
    mode: 'development',
    // devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        ...htmlWebpackPluginDevConfig.plugins,
        new webpack.NamedModulesPlugin(),//以便更容易查看要修补(patch)的依赖
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin('style/[name]_main[hash].css'),
        new CopyWebpackPlugin([{
            from: __dirname + '/src/help/static'
        }]),
        // new webpack.optimization.splitChunks({  //webpack4以后移除了CommonsChunkPlugin
        //     name: 'common' // 指定公共 bundle 的名称。
        // })
    ],
    optimization: {
        // minimize: true,
        minimizer: [
            new OptimizeCssAssetsPlugin({}),
            new UglifyJsPlugin({ test: /\.js($|\?)/i })
        ],
    },
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    // use: ["css-loader", 'postcss-loader']
                    use: [{
                        loader: 'css-loader',
                        // options: {
                        //     minimize: true //css压缩
                        // }
                    }, {
                        loader: 'postcss-loader'
                    }
                    ]
                }),
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components|dom-i18n.min)/,
                use: [{
                    loader: 'babel-loader',
                },
                {
                    loader: path.resolve("./inject-loader.js") // 开发模式使用注入代码实现html热更新
                }]
            }

        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist/help'),
        filename: 'js/[name].bundle[hash].js',
        chunkFilename: 'help.bundle.js',
    }
};