import Env from './deviceinfo';

export default {
  redirect_uri: 'https://test-scrm.juzhunshuyu.com',
  corpId: 'ww56913ac074369956',
  globalOpt: {
    appId: 'xlkp',
    appName: 'xlkp_chl',
    appVersion: '1.0',
    platformType: Env.getType().platformType,
    OSType: Env.getType().OSType,
  },
};
