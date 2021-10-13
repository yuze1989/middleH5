import Env from './deviceinfo';

// const redirectUri = process.env.NODE_ENV === 'production' ? 'https://mobile.juzhunshuyu.com' : 'https://test-scrm.juzhunshuyu.com';

const redirectUri = process.env.NODE_ENV === 'production' ? 'https://test-scrm.juzhunshuyu.com' : 'https://test-scrm.juzhunshuyu.com';

export default {
  redirect_uri: redirectUri,
  globalOpt: {
    appId: '',
    appName: '',
    appVersion: '',
    platformType: Env.getType().platformType,
    OSType: Env.getType().OSType,
  },
};
