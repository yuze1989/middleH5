<template>
  <div class="sop-box">
    <div class="sop-title">
      <span><i class="iconfont icon-bianzu sop-icon-color"></i> 小程序</span>
      <i class="iconfont icon-fasong1" @click="send({
        msgtype: content.msgType,
        miniprogram: {
          appid: content.miniprogram.title,
          title: content.miniprogram.picPath,
          imgUrl: content.miniprogram.description,
          page: content.miniprogram.url,
        }
      })"></i>
    </div>
    <div class="wechat-con">
      <div class="wechat-name">{{content.miniprogram.title}}</div>
      <div class="wechat-img"></div>
      <div class="wechat-size"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    send(content) {
      this.$emit('send', content);
    },
  },
};
</script>

<style scoped>
  .wechat-con {
    background: #FFFFFF;
    border: 1px solid rgba(0,0,0,0.08);
    padding: 1.1rem;
    width: 1.74rem;
  }
  .wechat-name {
    font-family: PingFangSC-Medium;
    font-weight: 500;
    font-size: 28px;
    color: rgba(0,0,0,0.85);
  }
  .wechat-img {
    margin-top: 0.6rem;
  }
  .wechat-img img {
    height: 8.8rem;
  }
</style>
