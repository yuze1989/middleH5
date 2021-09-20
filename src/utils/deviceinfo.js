/* eslint-disable no-underscore-dangle */
const browser = {
  versions: (() => {
    const u = navigator.userAgent.toLowerCase();
    return {
      trident: u.indexOf('Trident') > -1, // IE内核
      presto: u.indexOf('Presto') > -1, // opera内核
      webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或uc浏览器
      iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, // 是否iPad
      webApp: u.indexOf('safari') === -1, // 是否web应该程序，没有头部与底部
      wechat: u.indexOf('micromessenger') !== -1,
      qq: u.match(/QQ/i) === 'qq',
      deviceType: u.match(/(iPhone|iPod|iPad);?/i) ? 'I' : 'A',
    };
  })(),
  getType: () => {
    const ua = navigator.userAgent.toLowerCase();
    const obj = {
      OSType: '',
      platformType: 'H5',
    };
    if (/android/.test(ua)) {
      obj.OSType = 'A';
    } else if (/ios|iphone|ipad|ipod/.test(ua)) {
      obj.OSType = 'I';
    }
    const wxName = '__wxjs_environment';
    if (/miniprogram/.test(ua)) {
      obj.platformType = 'WX_XCX';
    } else if (/micromessenger/.test(ua) || window[wxName] === 'miniprogram') {
      obj.platformType = 'WX_GZ';
    } else if (/xlkp/.test(ua)) {
      obj.platformType = 'APP';
    }
    return obj;
  },
  app: navigator.appVersion,
  language: (navigator.browserLanguage || navigator.language).toLowerCase(),
};
export default browser;
