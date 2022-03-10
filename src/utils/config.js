import Env from './deviceinfo';

const redirectUri = process.env.VUE_APP_ENV !== 'development' ? 'https://www.juzhun.com' : 'https://test-scrm.juzhunshuyu.com';
const pcUrl = process.env.VUE_APP_ENV !== 'development' ? 'https://web.juzhun.com/#/home' : 'https://test-scrm.juzhunshuyu.com/scrm-web/#/home';
export default {
  redirect_uri: redirectUri,
  pcUrl,
  globalOpt: {
    appId: '',
    appName: '',
    appVersion: '',
    platformType: Env.getType().platformType,
    OSType: Env.getType().OSType,
  },
};
