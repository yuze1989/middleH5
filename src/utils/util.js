// import Config from './config';

const util = {
  getUrlOption: (url) => {
    let option = null;
    const hashes = url.slice(url.indexOf('?') + 1).split('&');
    for (let i = 0, len = hashes.length; i < len; i += 1) {
      if (i === 0) {
        option = {};
      }
      const [hash0, hash1] = hashes[i].split('=');
      option[hash0] = hash1;
    }
    return option;
  },
  // go(code) {
  //   const errorList = {
  //     '0100000005': ['您没有操作权限，请联系您所在企业的管理员', 0],
  //     '0100000006': ['您没有访问权限，请联系您所在企业的管理员', 0],
  //     '0100000007': ['您没有访问权限，请联系您所在企业的管理员', 0],
  //     errCode: ['检查网络情况后 再尝试访问', 1],
  //   };
  //   if (errorList[code]) {
  //     window.location.href = `${Config.redirect_uri}/middleH5/jurisdiction?msg=
  //     ${errorList[code][0]}&type=${errorList[code][1]}`;
  //   }
  // },
  getyyyyMMdd(time) {
    const date = new Date(time);
    const y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? (`0${m}`) : m;
    let d = date.getDate();
    d = d < 10 ? (`0${d}`) : d;
    let h = date.getHours();
    h = h < 10 ? (`0${h}`) : h;
    let minute = date.getMinutes();
    // 分
    minute = minute < 10 ? (`0${minute}`) : minute;
    // 秒
    // let second = date.getSeconds();
    // second = second < 10 ? (`0${second}`) : second;
    return `${y}-${m}-${d} ${h}:${minute}`;
  },
};

export default util;
