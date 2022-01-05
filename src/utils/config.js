import Env from './deviceinfo';

const redirectUri = process.env.NODE_ENV === 'production' ? 'https://www.juzhun.com' : 'https://test-scrm.juzhunshuyu.com';
const pcUrl = process.env.NODE_ENV === 'production' ? 'https://web.juzhun.com/#/home' : 'test-scrm.juzhunshuyu.com/scrm-web/#/home';

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
