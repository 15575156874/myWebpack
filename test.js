const glob = require('glob')
const path = require('path')
const util = require('./build/util')
function getEntry() {
    var obj = {
        detail: {},
        entry: {}
    }
    glob.sync("./src/**/**/*.html").forEach(e => {
        let arr = e.split('/')
        function getDir(arr) {
            let arr1 = JSON.parse(JSON.stringify(arr))
            arr1.splice(-1)
            return arr1
        }
        obj['detail'][arr[arr.length - 1].split('.')[0]] = {
            name: arr[arr.length - 1].split('.')[0],
            path: e,
            dir: path.resolve(__dirname, `${getDir(arr).join('/')}`)
        }
        obj['entry'][arr[arr.length - 1].split('.')[0]] = `${getDir(arr).join('/')}` + '/main.js'
    })
    console.log(obj)
}
process.env.NODE_ENV = 'dev'
console.log(process.env.ENV_file)
