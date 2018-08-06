const util = require('./util')
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
module.exports = {
    entry: util.obj.entry,
    plugins: [
        new ExtractTextPlugin('style/[name]_main[hash].css'),
        new CleanWebpackPlugin([`../dist/${process.env.ENV_file}`],
            {
                allowExternal: true //允许删除根目录以外的文件夹
            }),
        ...util.htmlWebpackPluginDevConfig.plugins,
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, `../src/${process.env.ENV_file}/static`)
        }]),
    ],
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
                    }, {
                        loader: 'postcss-loader'
                    }
                    ]
                }),
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components|dependencies)/,
                use: [{
                    loader: 'babel-loader',
                },
                {
                    loader: path.resolve("./inject-loader.js") // 开发模式使用注入代码实现html热更新
                }
                ]
            }

        ]
    },
    output: {
        path: path.resolve(__dirname, `../dist/${process.env.ENV_file}`),
        filename: 'js/[name].bundle[hash].js',
        chunkFilename: 'help.bundle.js',
    }
};