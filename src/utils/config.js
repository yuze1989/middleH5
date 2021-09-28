import Env from './deviceinfo';

export default {
  redirect_uri: 'https://test-scrm.juzhunshuyu.com',
  globalOpt: {
    appId: '',
    appName: '',
    appVersion: '',
    platformType: Env.getType().platformType,
    OSType: Env.getType().OSType,
  },
};
