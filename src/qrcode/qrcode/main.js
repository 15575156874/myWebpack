require('../dependencies/base64/base64.js')
require('../dependencies/jquery/dist/jquery.js')
require('../dependencies/jquery-qrcode/index.js')
require('../dependencies/jquery.i18n/index.js')
require('../dependencies/jquery.i18n.messagestore/index.js')
require('../dependencies/html2canvas/index.js')
require('../styles/main.css')
var querystring = function querystring(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
};
function getSelectArr(brand) {  // 将后台传的["ALP","WXP","WHK","UPI","MCC","VIS"]进行分类，得到一个数组，根据数组去判断渲染结果
  var brandArr = {};
  var brandMap = {
    ALP: 'Intergrated',
    WXP: 'Intergrated',
    WHK: 'Intergrated',
    UPI: 'Aggregated',
    MCC: 'Aggregated',
    VIS: 'Aggregated',
  };
  for (var i = 0; i < brand.length; i++) {
    if (brandArr[brandMap[brand[i]]]) {
      brandArr[brandMap[brand[i]]].push(brand[i]);
    } else if (brandMap[brand[i]]) {
      brandArr[brandMap[brand[i]]] = [];
      brandArr[brandMap[brand[i]]].push(brand[i]);
    }
  }
  return brandArr;
}
var userLang = (navigator.language || navigator.userLanguage).toLowerCase();

var helper = {
  //获取像素密度
  getPixelRatio: function (context) {
    var backingStore = context.backingStorePixelRatio ||
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio || 1;
    return (window.devicePixelRatio || 1) / backingStore;
  }
};

var spMap = {
  tis: {
    logo: 'images/logo-tis.png',
    tel: '+86-21-60278098',
    website: 'www.everonet.com',
    txt: 'collect_qrcode_tech_support'
  },
  evo: {
    logo: 'images/logo.png',
    tel: '+86-21-60278098',
    website: 'www.everonet.com',
    txt: 'collect_qrcode_tech_support'
  },
  ms: {
    logo: 'images/logo-ms.png',
    tel: '03-6279-0521',
    website: 'www.merchant-s.com',
    txt: 'collect_qrcode_tech_support_ms'
  },
  uniweb: {
    logo: 'images/logo-uniweb.png',
    tel: '65 91208270',
    website: 'www.uniwebpay.com',
    txt: 'collect_qrcode_tech_support_uniweb'
  },
  boccc: {
    logo: 'images/logo-boccc.png',
    tel: '+86-21-60278098',
    website: 'www.everonet.com',
    txt: 'collect_qrcode_tech_support'
  },
  judypay: {
    logo: 'images/logo-judypay.png',
    tel: '+6496019665',
    website: 'www.judypayx.com',
    txt: 'collect_qrcode_tech_support_judypay'
  },
  allpay: {
    logo: 'images/logo-allpay.png',
    tel: '021-61859588',
    website: 'www.allpayx.com',
    txt: 'collect_qrcode_tech_support_allpay'
  }
};

var options = {
  // render method: 'canvas', 'image' or 'div'
  render: 'div',
  // version range somewhere in 1 .. 40
  minVersion: 1,
  maxVersion: 40,
  // error correction level: 'L', 'M', 'Q' or 'H'
  ecLevel: 'H',
  // offset in pixel if drawn onto existing canvas
  left: 0,
  top: 0,
  // size in pixel
  size: 220,
  // code color or image element
  fill: '#000',
  // background color or image element, null for transparent background
  background: '#FFF',
  // content
  text: '',
  // corner radius relative to module width: 0.0 .. 0.5
  radius: 0,
  // quiet zone in modules
  quiet: 1,
  // modes
  // 0: normal
  // 1: label strip
  // 2: label box
  // 3: image strip
  // 4: image box
  mode: 4,
  mSize: 0.2,
  mPosX: 0.5,
  mPosY: 0.5,
  label: 'no label',
  fontname: 'sans',
  fontcolor: '#000'
};

var pending = false;

function i18nUpdate(locale) {
  var i18n = $.i18n();
  i18n.locale = locale;
  i18n.load('./i18n/' + locale + '.json', i18n.locale).done(function () {
    $('[data-i18n]').i18n();
  });
}

$(document).ready(function () {
  var platform = querystring('p');
  if (!platform) {
    platform = 'tis';
  }

  var info = spMap[platform];
  if (!info) {
    info = spMap.tis;
  }

  if (platform != 'boccc') {
    if (/^zh/.test(userLang)) {
      if (/^zh-cn/.test(userLang)) {
        i18nUpdate('zh');
      } else {
        i18nUpdate('zh-tw');
      }
    } else if (/^ja/.test(userLang)) {
      i18nUpdate('ja');
    } else if (/^th/.test(userLang)) {
      i18nUpdate('th');
    } else {
      i18nUpdate('en');
    }

    $('.everonet-container').css({
      'display': 'block'
    });
    $('#qrcode-title').css({
      'display': 'block'
    });
  }

  if (platform === 'boccc') {
    if (/^zh/.test(userLang)) {
      if (/^zh-cn/.test(userLang)) {
        i18nUpdate('zh');
        $('#qrcode-title').text('扫 码 付 款');
      } else {
        i18nUpdate('zh-tw');
        $('#qrcode-title').text('掃 碼 付 款');
      }
    } else {
      i18nUpdate('en');
      $('#qrcode-title').text('Scan QR Code to Pay');
    }

    $('#qrcode-title').css({
      'display': 'block'
    });
  }

  $('#tel').text(info.tel);
  $('#website').text(info.website);
  $('#logo').attr('src', info.logo);
  $('#techSupport').attr('data-i18n', info.txt);

  var data = querystring('data');
  if (!data) {
    return;
  }
  var store = JSON.parse(decodeURIComponent(window.atob(data)));
  var brandGroups = getSelectArr(store.brands)
  var brandGroupsKeys = Object.keys(brandGroups)
  // 生成二维码
  function showQrcode(url) {
    options.text = url;
    //console.log(url)
    $('.selectContainer').css({ display: 'none' })
    $('.container').css({ display: 'block', });
    if (url.indexOf('http') > -1) {
      loadBrands(brandGroups['Intergrated'])
    } else {
      loadBrands(brandGroups['Aggregated'])
    }
    $('#qrcode').qrcode(options).find('.logo-container').show();
  }
  // 填充卡品牌
  function loadBrands(brandCard) {
    for (var i in brandCard) {
      $('#' + brandCard[i] + 'card').css({ display: 'inline-block' })
    }
  }
  //console.log(store)
  // 填充门店名称

  //console.log('处理完的数据', brandGroups, brandGroupsKeys)
  if (brandGroupsKeys.length > 1) {
    $('.selectContainer').css({ display: 'block', });
    $('#title').css({ display: 'block', });
    //添加点击事件
    for (var i in brandGroupsKeys) {
      for (var key in brandGroups[brandGroupsKeys[i]]) { //加载按钮图片
        $('#' + brandGroups[brandGroupsKeys[i]][key]).css({ display: 'inline-block', });
      }
      $('#' + brandGroupsKeys[i]).css({ display: 'block', });
      (function (id) { //闭包存储，不用Let是因为没有加巴伯转义，不兼容低版本
        document.getElementById(id).addEventListener('click', function () {
          if (id == 'Intergrated') {
            showQrcode(store.url)
          } else {
            showQrcode(store.emvcode)
          }
        })
      })(brandGroupsKeys[i])
    }
  } else if (brandGroupsKeys.length == 1) { //直接渲染
    $('.container').css({
      display: 'block',
    });
    if (brandGroupsKeys[0] == 'Intergrated') {
      showQrcode(store.url)
    } else {
      showQrcode(store.emvcode)
    }
  }

  //如果不可用
  if ((store.brands.length === 1 && store.brands[0] === 'TRU') || store.brands.length === 0) {
    $('#brandWarning').css({
      'display': 'flex'
    });
    $('#qrcode').css({
      'filter': 'blur(3px)'
    });
    $('#save').css({
      'background-color': '#AAA'
    }).attr('disabled', 'true');
  }

  $('#storeName').text(store.storeName);
  $('#no').text(store.code);
  pending = false;

  // 绑定事件
  $('#save').on('click', function () {
    var hasSaved = $('#save').hasClass('saved');
    if (hasSaved) {
      return;
    }

    if (pending) {
      return;
    }

    pending = true;
    $('#save').children('div').addClass('loader');
    var shareContent = $('#imageContainer')[0]; // 需要绘制的部分的 (原生）dom 对象 ，注意容器的宽度不要使用百分比，使用固定宽度，避免缩放问题
    var width = $('#imageContainer').width(); // 获取(原生）dom 宽度
    var height = $('#imageContainer').height(); // 获取(原生）dom 高
    var offsetTop = $('#imageContainer').offset().top; //元素距离顶部的偏移量

    var canvas = document.createElement('canvas'); //创建canvas 对象
    var context = canvas.getContext('2d');
    var scaleBy = helper.getPixelRatio(context); //获取像素密度的方法 (也可以采用自定义缩放比例)
    canvas.width = (width + 300) * scaleBy; //这里 由于绘制的dom 为固定宽度，居中，所以没有偏移
    canvas.height = (height + offsetTop) * scaleBy; // 注意高度问题，由于顶部有个距离所以要加上顶部的距离，解决图像高度偏移问题
    context.scale(scaleBy, scaleBy);
    var opts = {
      allowTaint: true, //允许加载跨域的图片
      tainttest: true, //检测每张图片都已经加载完成
      scale: scaleBy, // 添加的scale 参数
      canvas: canvas, //自定义 canvas
      logging: false, //日志开关，发布的时候记得改成false
      width: width + 200, //dom 原始宽度
      height: height, //dom 原始高度
      // onrendered: function (canvas) {
      // }
    };
    html2canvas(shareContent, opts).then(function (canvas) {
      var imgData = canvas.toDataURL('image/png');
      var ua = window.navigator.userAgent;
      if (/EvoCashier_android/.test(ua)) {
        window.everonet.saveImage(imgData);
      } else if (/EvoCashier_ios/.test(ua)) {
        if (window.webkit) {
          if (window.webkit.messageHandlers) {
            window.webkit.messageHandlers.saveImage.postMessage(imgData);
          }
        } else {
          window.everonetJS.saveImage(imgData);
        }
      } else {
        var image = new Image();
        image.src = imgData;
        //document.getElementsByTagName('body')[0].appendChild(image)
        var anchor = document.createElement('a');
        anchor.setAttribute('href', image.src);
        anchor.setAttribute('download', 'qrcode.png');
        anchor.click();
        if (image.src === undefined) {
          imageSavedFailed();
        } else {
          imageSaved();
        }
      }
    });
  });
});

function imageSaved() {
  $('#save').addClass('hide');
  $('#saved').removeClass('hide');
}

function imageSavedFailed() {
  $('#save').children('div').removeClass('loader');
  pending = false;
}
//JTdCJTIyaW50U3RvcmVDb2RlJTIyJTNBJTIyUzAwMDA4OCUyMiUyQyUyMnRlcm1Db2RlJTIyJTNBJTIyOTAyMCUyMiUyQyUyMmNvZGUlMjIlM0ElMjI0MTUyOTM0MDc4JTIyJTJDJTIyc3RvcmVOYW1lJTIyJTNBJTIyaU9TJUU0JUI4JTkzJUU3JTk0JUE4LSVFNyU5QSVBRSVFNSU4RCVBMSVFNCVCOCU5OCElRTUlOTUlOEElRTUlQjAlQjElRTUlODYlQjMlRTUlQUUlOUElRTYlOTglQUYlRTQlQkQlQTAlRTUlOTUlQTYhSlBZJTIyJTJDJTIyYnJhbmRzJTIyJTNBJTVCJTIyRE9UJTIyJTJDJTIyVVBJJTIyJTJDJTIyQUxQJTIyJTJDJTIyTUNDJTIyJTJDJTIyV1hQJTIyJTVEJTJDJTIydXJsJTIyJTNBJTIyaHR0cHMlM0ElMkYlMkZjYXNoaWVyLmV2ZXJvbmV0LmNvbSUyRmYlMkY0MTUyOTM0MDc4JTIyJTJDJTIyZW12Y29kZSUyMiUzQSUyMjAwMDAwMDAwJTIyJTdE 两者都有
//只有upi
// JTdCJTIyaW50U3RvcmVDb2RlJTIyJTNBJTIyUzAwMDA4OCUyMiUyQyUyMnRlcm1Db2RlJTIyJTNBJTIyOTAyMCUyMiUyQyUyMmNvZGUlMjIlM0ElMjI0MTUyOTM0MDc4JTIyJTJDJTIyc3RvcmVOYW1lJTIyJTNBJTIyaU9TJUU0JUI4JTkzJUU3JTk0JUE4LSVFNyU5QSVBRSVFNSU4RCVBMSVFNCVCOCU5OCElRTUlOTUlOEElRTUlQjAlQjElRTUlODYlQjMlRTUlQUUlOUElRTYlOTglQUYlRTQlQkQlQTAlRTUlOTUlQTYhSlBZJTIyJTJDJTIyYnJhbmRzJTIyJTNBJTVCJTIyVVBJJTIyJTJDJTIyTUNDJTIyJTVEJTJDJTIydXJsJTIyJTNBJTIyaHR0cHMlM0ElMkYlMkZjYXNoaWVyLmV2ZXJvbmV0LmNvbSUyRmYlMkY0MTUyOTM0MDc4JTIyJTJDJTIyZW12Y29kZSUyMiUzQSUyMjAwMDAwMDAwJTIyJTdE
