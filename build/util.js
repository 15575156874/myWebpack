//获得一个动态的目录
const glob = require('glob')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
//import glob from "glob"
var obj = {
    detail: {},
    entry: {
    }
}
const htmlWebpackPluginDevConfig = { plugins: [] }
glob.sync(`./src/${process.env.ENV_file}/**/*.html`).forEach(e => { //同步
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
module.exports = { obj, htmlWebpackPluginDevConfig }
