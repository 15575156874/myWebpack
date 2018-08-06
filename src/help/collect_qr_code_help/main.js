
window.domI18n = require('../dependencies/dom-i18n.min')
require('./index.css')
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
        //txt = `您可在 ${app} 上搜尋這筆交易或以掃描槍(如有)掃描此條碼。`
    } else if (/^th/.test(userLang)) {
        i18n.changeLanguage('th');
        //txt = `您可在 ${app} 上搜尋這筆交易或以掃描槍(如有)掃描此條碼。`
    }
    container.classList.add('show');
}