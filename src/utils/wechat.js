/* eslint-disable no-undef */
import Http from './http';
import Config from './config';

const Wechat = {
  setWxConfig: () => {
    Http.post('/scrm/wechat/js-api-signature', {
      corpId: Config.corpId,
      url: window.location.href.split('#')[0],
    }).then((res) => {
      Wechat.setAgentConfig(res.data);
    });
  },
  setAgentConfig: (configInfo) => {
    wx.agentConfig({
      corpid: Config.corpId, // 必填，企业微信的corpid，必须与当前登录的企业一致
      agentid: 1000014, // 必填，企业微信的应用id （e.g. 1000247）
      timestamp: configInfo.timestamp, // 必填，生成签名的时间戳
      nonceStr: configInfo.nonceStr, // 必填，生成签名的随机串
      signature: configInfo.signature, // 必填，签名，见附录-JS-SDK使用权限签名算法
      jsApiList: ['sendChatMessage'], // 必填，传入需要使用的接口名称
      success: (res) => {
        console.log(res);
        // 回调
      },
      fail: (res) => {
        if (res.errMsg.indexOf('function not exist') > -1) {
          alert('版本过低请升级');
        }
      },
    });
  },
  sendChatMessage: (str, type, text, url) => {
    console.log(str, type);
    let news = 'text';
    if (type === (0 || 1)) {
      news = 'news';
      return;
    }
    if (type === 2) {
      news = 'image';
      return;
    }
    if (type === 3) {
      news = 'video';
      return;
    }
    if (type === (4 || 5)) {
      news = 'file';
      return;
    }
    wx.invoke('sendChatMessage', {
      msgtype: news, // 消息类型，必填
      enterChat: true, // 为true时表示发送完成之后顺便进入会话，仅移动端3.1.10及以上版本支持该字段
      text: {
        content: text, // 文本内容
      },
      image: {
        mediaid: type === 2 ? str.materialEnclosureId : '', // 图片的素材id
      },
      video: {
        mediaid: type === 3 ? str.materialEnclosureId : '', // 视频的素材id
      },
      file: {
        mediaid: type === (4 || 5) ? str.materialEnclosureId : '', // 文件的素材id
      },
      news: {
        link: url, // H5消息页面url 必填
        title: str.title, // H5消息标题
        desc: str.description, // H5消息摘要
        imgUrl: str.coverPicUrl, // H5消息封面图片URL
      },
    }, (res) => {
      alert(res.err_msg);
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
    wx.error((res) => {
      // location.reload()
      console.log('wx error ===', res);
    });
    wx.checkJsApi({
      jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'],
      openTagList: ['wx-open-launch-weapp'],
      success: (res) => {
        // window.isSetWxconfig = true // 在window中添加isSetWxconfig,判断是否进行页面刷新
        console.log('检查jsapi==', res);
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
};

export default Wechat;
