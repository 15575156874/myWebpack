
window.domI18n = require('../dependencies/dom-i18n.min')
require('../styles/main.css')
console.log(123123)
const querystring = function querystring(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
};
function showCnTranslate() {
  console.log('翻译')
  let translates = document.getElementsByClassName('translate')
  let length = document.getElementsByClassName('translate').length
  for (var i = 0; i < length; i++) {
    translates[i].style.display = 'block'
  }
}
let app = 'QR×DRIVE';

const container = document.getElementById('container');

let txt = `您可在 ${app} 上搜寻这笔交易或以扫描枪(如有)扫描此条形码。`;
let wxpic1 = './images/wx1-zh.png';
let wxpic2 = './images/wx2-zh.png';
let wxpic3 = './images/wx3-zh.png';
let wxpic4 = './images/wx4-zh.png';
let wxpic5 = './images/wx5-zh.png';
let wxpic6 = './images/wx6-zh.png';
let wxpic7 = './images/wx7-zh.png';

let alipic1 = './images/ali1-zh.png';
let alipic2 = './images/ali2-zh.png';
let alipic3 = './images/ali3-zh.png';
let alipic4 = './images/ali4-zh.png';
let alipic5 = './images/ali5-zh.png';

const bank1 = './images/bank1-zh.png';
let bank2 = './images/bank2-zh.png';
let bank3 = './images/bank3-zh.png';
let bank4 = './images/bank4-zh.png';
let bank5 = './images/bank5-zh.png';

const i18n = window.domI18n({
  selector: '[data-translatable]',
  separator: '//$ ',
  languages: ['zh', 'en', 'zh-hant', 'ja', 'th'],
  defaultLanguage: 'en',
  currentLanguage: 'en',
});
const userLang = (navigator.language || navigator.userLanguage).toLowerCase();
window.onload = function () {
  if (/^zh/.test(userLang)) {
    if (/^zh-cn/.test(userLang)) {
      i18n.changeLanguage('zh');
    } else {
      i18n.changeLanguage('zh-hant');
      wxpic1 = './images/wx1-zh-hant.png';
      wxpic2 = './images/wx2-zh-hant.png';
      wxpic3 = './images/wx3-zh-hant.png';
      wxpic4 = './images/wx4-zh-hant.png';
      wxpic5 = './images/wx5-zh-hant.png';
      wxpic6 = './images/wx6-zh-hant.png';
      wxpic7 = './images/wx7-zh-hant.png';

      alipic1 = './images/ali1-zh-hant.png';
      alipic2 = './images/ali2-zh-hant.png';
      alipic3 = './images/ali3-zh-hant.png';
      alipic4 = './images/ali4-zh-hant.png';
      alipic5 = './images/ali5-zh-hant.png';

      // let bank1 = './images/bank1-zh-hant.png'
      bank2 = './images/bank2-zh-hant.png';
      bank3 = './images/bank3-zh-hant.png';
      bank4 = './images/bank4-zh-hant.png';
      bank5 = './images/bank5-zh-hant.png';
      txt = `您可在 ${app} 上搜尋這筆交易或以掃描槍(如有)掃描此條碼。`;
    }
  } else if (/^ja/.test(userLang)) {
    showCnTranslate()
    i18n.changeLanguage('ja');
    txt = `${app} 上当該取引を検索するか或いはスキャンバー(ある場合)でバーコードをスキャンする`
  } else if (/^th/.test(userLang)) {
    showCnTranslate()
    i18n.changeLanguage('th');
    txt = `โปรดสแกนบาร์โค้ดหรือป้อนรหัสธุรกรรมแล้วคุณจะพบรายการนี้ใน ${app}`
  } else {
    showCnTranslate()
    // wxpic1 = './images/wx1-en.png';
    // wxpic2 = './images/wx2-en.png';
    // wxpic3 = './images/wx3-en.png';
    // wxpic4 = './images/wx4-en.png';
    // wxpic5 = './images/wx5-en.png';
    // wxpic6 = './images/wx6-en.png';
    // wxpic7 = './images/wx7-en.png';

    // alipic1 = './images/ali1-en.png';
    // alipic2 = './images/ali2-en.png';
    // alipic3 = './images/ali3-en.png';
    // alipic4 = './images/ali4-en.png';
    // alipic5 = './images/ali5-en.png';
    txt = `Please scan the barcode or enter the transaction ID, then you will find this transaction in ${app}`
  }

  if (document.URL.indexOf('weixin') >= 0) {
    document.getElementById('wxpic1').setAttribute('src', wxpic1);
    document.getElementById('wxpic2').setAttribute('src', wxpic2);
    document.getElementById('wxpic3').setAttribute('src', wxpic3);
    document.getElementById('wxpic4').setAttribute('src', wxpic4);
    document.getElementById('wxpic5').setAttribute('src', wxpic5);
    document.getElementById('wxpic6').setAttribute('src', wxpic6);
    document.getElementById('wxpic7').setAttribute('src', wxpic7);
  }

  if (document.URL.indexOf('alipay') >= 0) {
    document.getElementById('alipic1').setAttribute('src', alipic1);
    document.getElementById('alipic2').setAttribute('src', alipic2);
    document.getElementById('alipic3').setAttribute('src', alipic3);
    document.getElementById('alipic4').setAttribute('src', alipic4);
    document.getElementById('alipic5').setAttribute('src', alipic5);
  }
  if (document.URL.indexOf('bank') >= 0) {
    document.getElementById('bank1').setAttribute('src', bank1);
    document.getElementById('bank2').setAttribute('src', bank2);
    document.getElementById('bank3').setAttribute('src', bank3);
    document.getElementById('bank4').setAttribute('src', bank4);
    document.getElementById('bank5').setAttribute('src', bank5);
  }
  document.getElementById('cashierOpeTxt').innerText = txt;
  container.classList.add('show');
};