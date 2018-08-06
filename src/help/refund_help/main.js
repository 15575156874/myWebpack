
require('../styles/refund_help.css')
window.domI18n = require('../dependencies/dom-i18n.min.js')
console.log('呵呵哒')
// '{"brands": ["ALP","WXP","UPI","MCC","VIS"],'app':}')
function getSelectArr(e) {  // 将后台传的["ALP","WXP","WHK","UPI","MCC","VIS"]进行分类，得到一个数组，根据数组去判断渲染结果
    var brandArr = {};
    var brandMap = {
        ALP: 'alipayBtn',
        WXP: 'weixinBtn',
        UPI: 'bankBtn',
        VIS: 'bankBtn',
        MCC: 'bankBtn',
    };
    console.log(e)
    for (var i = 0; i < e.length; i++) {
        if (brandArr[brandMap[e[i]]]) {
            brandArr[brandMap[e[i]]].push(e[i]);
        } else {
            if (brandMap[e[i]]) {
                brandArr[brandMap[e[i]]] = [];
                brandArr[brandMap[e[i]]].push(e[i]);
            }

        }
    }
    return brandArr;
}

function querystring(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};
function getBase64(name) {
    try {
        return JSON.parse(decodeURIComponent(atob(querystring(name))))
    } catch (err) {
        return { brands: ["ALP", "WXP"] }
    }

}
var arr = getSelectArr(getBase64('data').brands)
console.log(arr)
for (var i in arr) {
    if (document.getElementById(i)) {
        document.getElementById(i).style.display = 'inline-table'
    }
    for (var e in arr[i]) {
        document.getElementById(arr[i][e]).style.display = 'block'
    }
}
var app = querystring('p') || querystring('p');

var i18n = window.domI18n({
    selector: '[data-translatable]',
    separator: '//$ ',
    languages: ['zh', 'en', 'zh-hant', 'ja', 'th'],
    defaultLanguage: 'en',
    currentLanguage: 'en'
});

var container = document.getElementById('container');

window.onload = function () {
    var userLang = (navigator.language || navigator.userLanguage).toLowerCase();
    if (/^zh/.test(userLang)) {
        if (/^zh-cn/.test(userLang)) {
            i18n.changeLanguage('zh');
        } else {
            i18n.changeLanguage('zh-hant');
        }
    } else if (/^ja/.test(userLang)) {
        i18n.changeLanguage('ja');
    } else if (/^th/.test(userLang)) {
        i18n.changeLanguage('th');
    }
    container.classList.add('show');
}
console.log(32132123)
// if (module.hot) {
//     module.hot.accept()
// }

