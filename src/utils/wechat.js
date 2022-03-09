/* eslint-disable no-undef */
import Http from './http';

let wxSignature;

export const defaultOptions = {
  fromDepartmentId: 0, // 必填，表示打开的通讯录从指定的部门开始展示，-1表示自己所在部门开始, 0表示从最上层开始
  mode: 'multi', // 必填，选择模式，single表示单选，multi表示多选
  type: ['department'], // 必填，选择限制类型，指定department、user中的一个或者多个
  selectedDepartmentIds: [], // 非必填，已选部门ID列表。用于多次选人时可重入，single模式下请勿填入多个id
  selectedUserIds: [], // 非必填，已选用户ID列表。用于多次选人时可重入，single模式下请勿填入多个id
};

const Wechat = {
  setWxConfig: async () => {
    const res = await Http.post('/scrm/wechat/js-api-signature', {
      corpId: localStorage.getItem('corpId'),
      url: window.location.href.split('#')[0],
    });
    wxSignature = res.data;
  },
  setAgentConfig: async (info, type, func) => {
    await Wechat.setWxConfig();
    wx.agentConfig({
      corpid: wxSignature.corpId, // 必填，企业微信的corpid，必须与当前登录的企业一致
      agentid: localStorage.getItem('agentId'), // 必填，企业微信的应用id （e.g. 1000247）
      timestamp: wxSignature.timestamp, // 必填，生成签名的时间戳
      nonceStr: wxSignature.nonceStr, // 必填，生成签名的随机串
      signature: wxSignature.signature, // 必填，签名，见附录-JS-SDK使用权限签名算法
      jsApiList: ['sendChatMessage', 'openExistedChatWithMsg', 'getCurExternalContact',
        'openEnterpriseChat', 'shareToExternalMoments'], // 必填，传入需要使用的接口名称
      success: () => {
        wx.invoke(type, info, (res) => {
          if (res.userId) {
            sessionStorage.setItem('userId', res.userId);
          }
          if (func) {
            func();
          }
        });
        // 回调
      },
      fail: (res) => {
        console.log(res);
        if (res.errMsg.indexOf('function not exist') > -1) {
          // alert('版本过低请升级');
        }
      },
    });
  },
  setApi: (configInfo) => {
    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: configInfo.corpId, // 必填，公众号的唯一标识
      timestamp: configInfo.timestamp, // 必填，生成签名的时间戳
      nonceStr: configInfo.nonceStr, // 必填，生成签名的随机串
      signature: configInfo.signature, // 必填，签名，见附录1
      jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      openTagList: ['wx-open-launch-weapp'],
    });
    wx.error(() => {
      // location.reload()
    });
    wx.checkJsApi({
      jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'],
      openTagList: ['wx-open-launch-weapp'],
      success: () => {
        // window.isSetWxconfig = true // 在window中添加isSetWxconfig,判断是否进行页面刷新
        // console.log('检查jsapi==', res);
        // alert(JSON.stringify(res));
        // 以键值对的形式返回，可用的api值true，不可用为false
        // 如：{'checkResult':{'chooseImage':true},'errMsg':'checkJsApi:ok'}
      },
    });
  },
  customShare: (shareInfo) => {
    if (/(Android)/i.test(window.navigator.userAgent)) {
      // 在 Android 设备，需要获取新的签名
      Wechat.setWxConfig();
    }
    wx.ready(() => {
      wx.updateAppMessageShareData(shareInfo);
      wx.updateTimelineShareData(shareInfo);
    });
    wx.updateAppMessageShareData(shareInfo);
    wx.updateTimelineShareData(shareInfo);
  },
  selectEnterpriseContact: (options = defaultOptions) => new Promise((resolve) => {
    wx.invoke('selectEnterpriseContact', {
      ...options,
    }, (res) => {
      if (res.err_msg === 'selectEnterpriseContact:ok') {
        if (typeof res.result === 'string') {
          resolve(JSON.parse(res.result)); // 由于目前各个终端尚未完全兼容，需要开发者额外判断result类型以保证在各个终端的兼容性
        } else {
          resolve(res.result);
        }
      }
    });
  }),
  initWeChat: async () => {
    await Wechat.setWxConfig();
    Wechat.registerConfig();
  },
  registerConfig: () => {
    wx.agentConfig({
      corpid: wxSignature.corpId, // 必填，企业微信的corpid，必须与当前登录的企业一致
      agentid: localStorage.getItem('agentId'), // 必填，企业微信的应用id （e.g. 1000247）
      timestamp: wxSignature.timestamp, // 必填，生成签名的时间戳
      nonceStr: wxSignature.nonceStr, // 必填，生成签名的随机串
      signature: wxSignature.signature, // 必填，签名，见附录-JS-SDK使用权限签名算法
      jsApiList: ['checkJsApi', 'selectEnterpriseContact'], // 必填，传入需要使用的接口名称
      success: (res) => {
        // 回调
        console.log(res, 'success');
      },
      fail: (err) => {
        console.log(err, 'error');
      },
    });
  },
};

export default Wechat;
