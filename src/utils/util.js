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
  setRem: () => {
    const scale = document.documentElement.clientWidth / 750;
    document.documentElement.style.fontSize = `${20 * Math.min(scale, 2)}px`;
  },
  onresizeRem: () => {
    util.setRem();
    window.onresize = () => {
      util.setRem();
    };
  },
};

export default util;
