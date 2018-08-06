const path = require("path");
module.exports = function (source) {
    var file = path.basename(this.resourcePath)
    var dir = this.resourcePath.split('/')[this.resourcePath.split('/').length - 2]
    console.log('------------------------------------', file, dir)
    if (process.env.NODE_ENV === "development" && file === "main.js" && dir !== 'scripts') {
        return `if (process.env.NODE_ENV === "development") {
        require("./${dir}.html");
    };` + source;
    }
    return source
}