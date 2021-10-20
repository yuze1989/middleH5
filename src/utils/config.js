import Env from './deviceinfo';

const redirectUri = process.env.NODE_ENV === 'production' ? 'https://www.juzhun.com' : 'https://test-scrm.juzhun.com';

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
