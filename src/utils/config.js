import Env from './deviceinfo';

export default {
  redirect_uri: 'https://test-scrm.juzhunshuyu.com',
  corpId: 'ww56913ac074369956',
  globalOpt: {
    appId: '',
    appName: '',
    appVersion: '',
    platformType: Env.getType().platformType,
    OSType: Env.getType().OSType,
  },
};
