import Env from './deviceinfo';

const redirectUri = process.env.VUE_APP_ENV !== 'development' ? 'https://scrm.juzhunshuyu.com/scrm/app-home-page/oauth-for-front' : 'https://test-scrm.juzhunshuyu.com/scrm/app-home-page/oauth-for-front';
const stateUrl = process.env.VUE_APP_ENV !== 'development' ? 'https://www.juzhun.com' : 'https://test-scrm.juzhunshuyu.com';
const pcUrl = process.env.VUE_APP_ENV !== 'development' ? 'https://web.juzhun.com/#/home' : 'https://test-scrm.juzhunshuyu.com/scrm-web/#/home';
const appId = process.env.VUE_APP_ENV !== 'development' ? 'ww6e445f207401738c' : 'ww24d388fb6f1b4d86';
export default {
  redirect_uri: redirectUri,
  state_url: stateUrl,
  pcUrl,
  globalOpt: {
    appId,
    appName: '',
    appVersion: '',
    platformType: Env.getType().platformType,
    OSType: Env.getType().OSType,
  },
};
